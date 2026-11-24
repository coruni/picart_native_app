# picart_native_app 项目长期约定

## UI 约定

- **所有可编辑输入框必须带光标主题色**：`TextInput` / `BottomSheetTextInput`
  统一加 `cursorColor={colors.primary}` + `selectionColor={colors.primary}`。
  - Android 光标色只看 `cursorColor`；iOS 的 `tintColor` 取自 `selectionColor`，两个都要给。
  - `editable={false}` 的假输入框（如文章底栏、评论区入口）不需要。
- 主色只有 `Colors.primary` (#6680ff)，亮暗主题一致，取 `useTheme()` 的 `colors.primary`。
- **富文本工具栏与它下面的所有面板必须是同一个底色 `theme.card`**（工具栏、
  功能面板、色板、表情面板）。面板里的小胶囊（`PanelChip`）反过来用 `theme.muted`，
  否则在卡片底色上看不出边界。面板之间只用 `theme.border` 的 hairline 分隔。

## 注释规范

- **一条注释只写一句口语，别写多行 JSDoc**。优先写「为什么」，纯描述代码在干嘛的直接不写。
- 没有 `// ─── 分区标题 ───` 这类装饰线。
- `eslint-disable` / `@ts-*` / 被注释掉的旧代码块原样保留，不参与整理。

## 图片 / 视频

- 相册选图 `quality` 必须给 `1`：`expo-image-picker` 在 `quality < 1` 时
  Android 会解码成位图重压，GIF 只保留首帧。压缩统一走
  `lib/uploadImage.ts` 的 `prepareContentImage`（内部跳过 GIF）。
- 视频抽帧必须逐帧串行（一次一个时间点），并发抽帧会在 Android 上 OOM / SIGSEGV。
- `VideoView` 在 sheet 内必须用 `surfaceType="textureView"`，否则 SurfaceView
  会盖住圆角与浮层控件。

## 视频预览播放（2026-11-14 重写）

- **预览播放一律用 `react-native-video`，不要用 expo-video 的 `player.play()`。**
  本机（小米）实测 expo-video 每次 play 后 0.1~0.4 秒就被原生 pause：焦点栈为空、
  AppState=active、status 一直是 readyToPlay、JS 侧零 pause 调用。改
  `audioMixingMode` 的 auto / duckOthers / mixWithOthers(+muted)、切后台再回前台、
  摘掉 VideoView 全都救不过来。RNV 用 `paused` 单向驱动，一次就正常。
- **抽帧仍用 expo-video 的 `generateThumbnailsAsync`，但必须「先抽帧、后挂播放器」**：
  两个播放器同时读同一份视频时，抽帧从第 3 帧起永久挂死（不 resolve 也不 reject）。
- 抽帧期间需要一个**与预览区等大的隐藏 `VideoView`**（缩成 1x1 也抽不动），
  抽完立刻卸载，否则这个整块大小的原生视图会吃掉预览区的点击。
- 抽帧 effect 的依赖里**不要放播放器 status**：loading→readyToPlay 会触发 cleanup
  把抽帧打断，而重启又被 uri guard 挡住，表现就是「只有一两帧，再也不动」。
- RNV 的 TextureView 不吃父层 `overflow:hidden` 裁剪，视频的直角会盖到圆角外面。
  圆角要用 **SVG path 遮罩**：一个 `evenodd` 的「外矩形 + 内圆角矩形」path
  （见 `VideoEditorSheet.tsx` 的 `buildCornerMaskPath`），只填四个角的弧形三角。
  注意两点：① `borderRadius` 拼不出这个形状（它只能裁掉圆角，留不出圆角外那块）；
  ② 遮罩**必须放在 `stage` 外面**——`stage` 自己的 `overflow:hidden` 会把遮罩正好裁掉，
  表现就是「圆角完全没生效」。
- 抽帧 / 抓帧调用一律包超时兜底（`withTimeout`，1.5~2s），抓帧超时就回退到已抽帧里
  时间最接近的一帧，避免按钮一直转圈。

## Android 原生依赖

- **media3 版本只能对齐 expo-video 的 AAR**：expo SDK 56 的 expo-* 模块是预编译
  AAR（`node_modules/expo-video/local-maven-repo`），其中 media3 版本不可降级。
  当前 `android/build.gradle` 的 `@media3-pin` 钉 1.9.0，改动前先看 AAR 的 POM。
  降级会让 `VideoPlayerLoadControl` 抛 `AbstractMethodError`（打开视频即闪退）。
- `react-native-video` 需 ≥ **6.19.3**：它用 `DefaultLoadControl.Builder` +
  反射兼容 1.8/1.9 两版 LoadControl；6.19.2 会在 1.9.0 上抛 `NoSuchMethodError`。

## 富文本编辑器（react-native-enriched-html，走 patch-package）

- **`Color.parseColor` 不认 `rgb()` / `rgba()`**：`constants/editorTextStyles.ts`
  的色板取值全是函数写法，原生的 `InlineStyles.parseCssColor` 必须自己解，
  不能用 `Color.parseColor`（它只吃 `#rgb` / `#aarrggbb`，且 CSS 的
  `#rrggbbaa` 通道顺序和它相反）。解析失败会被上层当成「清除」，表现为选色不生效。
- 单验原生改动：`android/gradlew :react-native-enriched-html:compileDebugKotlin`
  约 3.5 分钟，比整包 `run:android` 快得多。
- **工具栏上的浮层必须计入 `onOverlayChange`**（表情 / sheet / 功能面板都算）：
  父级只在 `keyboardShown || toolbarOverlayOpen` 时挂载工具栏，键盘一收就会把
  工具栏连同面板 state 一起卸载，表现为「面板一打开就自己关掉」。
- 面板里的 ScrollView 一定要 `keyboardShouldPersistTaps="handled"`，
  默认 `never` 会把第一次点击吃掉去收键盘，色块收不到 `onPress`。
- **收起键盘后要唤回，不能只 `editor.focus()`**：`KeyboardController.dismiss({keepFocus:true})`
  在 iOS 上是把 `inputView` 换成空 UIView（仍是 first responder），`reactFocus` 是空操作。
  统一走 `ArticleRichTextToolbar.tsx` 的 `resumeKeyboard()`：
  `KeyboardController.setFocusTo("current")` + `editor.focus()` + `setSelection(end,end)`。
- 色板 / 表情面板和键盘互斥：打开时 `dismiss({keepFocus:true})`、面板高度取
  `panelHeight`（键盘高度 - 工具栏行高）、关闭时 `resumeKeyboard()`；
  键盘自行弹出（用户点正文）时自动收面板。
- 生成补丁见 `.workbuddy/memory/2026-11-13.md` 的 Windows 踩坑记录
  （先 `mv` 掉包的 `android/build` 再 `npx patch-package`）。
- **编辑器存不下富块（如内联帖子 `ql-inline-article-list`）**：enriched-html 的
  `EnrichedParser.fromHtml` 把 HTML 转 span，自定义属性（`data-articles`）会被丢掉，
  回读会把块拍平。富内容只能在 React 侧存元数据，正文里放普通链接，发布时
  用 `lib/inlineArticle.ts` 的 `upgradeInlinePosts` 升级成卡片块；阅读端样式放在
  `ArticleHtmlWebView.buildStyleBlock`（移植网页端 `inline-article.css`，token 换主题色）。

## 打开 BottomSheet

- 面板打开前先 `KeyboardController.dismiss()`（`app/publish/index.tsx` 的
  `dismissKeyboardBeforeSheet()`），否则键盘会把面板顶到上沿。
