const { withProjectBuildGradle } = require("expo/config-plugins");

/**
 * 把 androidx.media3 钉到固定版本。
 *
 * 背景：`react-native-video` 和 `expo-video` 各自用 `implementation` 声明了不同
 * 版本的 media3（前者 1.8.0，后者 1.9.0）。`implementation` 不传递，所以两个库
 * 编译期互不可见、各按各的版本编译；但打包时 Gradle 会做全局版本仲裁，同名依赖
 * 只保留最高的那个，于是运行时统一变成 1.9.0。
 *
 * 结果是 `react-native-video` 里 `RNVLoadControl` 调 1.8.0 的九参
 * `DefaultLoadControl` 构造函数，运行时找不到，抛 NoSuchMethodError。
 * 这是 Java 层异常，抛在原生视图的 Handler 回调里，JS 线程完全没参与，
 * 所以不会红屏、不会进 LogBox，表现就是「一点开视频就闪退」。
 *
 * 钉到 1.8.0 而不是 1.9.0：`react-native-video` 是源码编译的，钉 1.9.0 它会在
 * 编译期就报构造函数不存在。`expo-video` 在 1.8.0 下可以正常编译运行。
 *
 * 注意：`android/` 目录被 git 忽略，直接改 `android/build.gradle` 会在
 * `expo prebuild --clean` 后丢失，所以必须由这个插件在 prebuild 时注入。
 */
const PINNED_MEDIA3_VERSION = "1.8.0";

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

/** 幂等标记：重复执行 prebuild 不会叠加多份配置 */
const MARKER = "// @media3-pin-start";

function buildBlock() {
  return `
${MARKER}
// react-native-video 6.19.x 按 media3 1.8.0 编译，expo-video 声明 1.9.0。
// 不钉住的话运行时会解析到 1.9.0，RNVLoadControl 抛 NoSuchMethodError 直接闪退。
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
// @media3-pin-end
`;
}

function applyMedia3Pin(contents) {
  if (contents.includes(MARKER)) {
    return contents;
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
