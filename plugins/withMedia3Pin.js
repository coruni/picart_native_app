const { withProjectBuildGradle } = require("expo/config-plugins");

/**
 * 把 androidx.media3 钉到固定版本。
 *
 * 背景：`react-native-video` 和 `expo-video` 各自声明了不同版本的 media3
 * （前者 1.8.0，后者 1.9.0）。打包时 Gradle 做全局版本仲裁，同名依赖只保留
 * 最高的那个，运行时统一变成 1.9.0 —— 于是「谁按低版本编译，谁运行时就炸」。
 *
 * 两边的炸法：
 * - `expo-video` 从 56 起是**预编译 AAR**（`node_modules/expo-video/local-maven-repo`
 *   里那份），按 media3 1.9.0 编译。把它 force 到 1.8.0，AAR 里的
 *   `VideoPlayerLoadControl : DefaultLoadControl()` 就缺 `LoadControl.getAllocator()`，
 *   `ExoPlayerImplInternal.createMediaPeriodHolder` 一调用即
 *   `AbstractMethodError` —— 打开视频/抽帧闪现。预编译产物没法重新编译，只能对齐版本。
 * - `react-native-video` 6.19.2 及更早是源码编译，用 `super(...)` 调
 *   `DefaultLoadControl` 的旧构造器，跑在 1.9.0 上抛 `NoSuchMethodError`。
 *   6.19.3 起改用 `DefaultLoadControl.Builder` 构建，并同时声明
 *   `getAllocator()` / `getAllocator(PlayerId)`（后者用反射），官方注释写明
 *   「app 可能解析到比库编译时更新的 media3」。
 *
 * 所以正确做法是钉 **1.9.0**（与 AAR 编译版本一致），再靠 RNV ≥ 6.19.3 的兼容层
 * 让它以 1.8.0 编译、跑在 1.9.0 上。
 *
 * 注意：`android/` 目录被 git 忽略，直接改 `android/build.gradle` 会在
 * `expo prebuild --clean` 后丢失，所以必须由这个插件在 prebuild 时注入。
 */
const PINNED_MEDIA3_VERSION = "1.9.0";

const MEDIA3_MODULES = [
  "media3-common",
  "media3-exoplayer",
  "media3-exoplayer-dash",
  "media3-exoplayer-hls",
  "media3-exoplayer-smoothstreaming",
  "media3-exoplayer-rtsp",
  "media3-exoplayer-ima",
  "media3-datasource",
  "media3-datasource-okhttp",
  "media3-database",
  "media3-decoder",
  "media3-extractor",
  "media3-ui",
  "media3-session",
];

/** 幂等标记：重复执行 prebuild 时按标记重写整段，不会叠加多份配置 */
const MARKER = "// @media3-pin-start";
const END_MARKER = "// @media3-pin-end";

function buildBlock() {
  return `
${MARKER}
// expo-video 的预编译 AAR 按 media3 1.9.0 编译，钉低版本会让它的
// VideoPlayerLoadControl 缺 LoadControl.getAllocator()，抛 AbstractMethodError。
// react-native-video 6.19.3+ 已用 Builder + 反射兼容两版，可安全运行在 1.9.0 上。
def pinnedMedia3Version = "${PINNED_MEDIA3_VERSION}"
def media3Modules = [
${MEDIA3_MODULES.map((name) => `  "${name}",`).join("\n")}
]

allprojects {
  configurations.all {
    resolutionStrategy {
      media3Modules.each { moduleName ->
        force "androidx.media3:\${moduleName}:\${pinnedMedia3Version}"
      }
    }
  }
}
${END_MARKER}
`;
}

function applyMedia3Pin(contents) {
  const start = contents.indexOf(MARKER);
  const end = start === -1 ? -1 : contents.indexOf(END_MARKER, start);

  // 已有旧块（可能是旧版本号）：整段替换，避免残留 1.8.0
  if (start !== -1 && end !== -1) {
    const tail = contents.slice(end + END_MARKER.length).replace(/^\n/, "");
    return contents.slice(0, start) + buildBlock().trimStart() + tail;
  }

  return `${contents.trimEnd()}\n${buildBlock()}`;
}

module.exports = function withMedia3Pin(config) {
  return withProjectBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== "groovy") {
      throw new Error(
        "withMedia3Pin: android/build.gradle 不是 Groovy，无法注入 media3 pin",
      );
    }
    cfg.modResults.contents = applyMedia3Pin(cfg.modResults.contents);
    return cfg;
  });
};

// 供本地验证脚本调用
module.exports.applyMedia3Pin = applyMedia3Pin;
module.exports.MARKER = MARKER;
