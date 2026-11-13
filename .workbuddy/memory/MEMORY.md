# picart_native_app 项目长期约定

## UI 约定

- **所有可编辑输入框必须带光标主题色**：`TextInput` / `BottomSheetTextInput`
  统一加 `cursorColor={colors.primary}` + `selectionColor={colors.primary}`。
  - Android 光标色只看 `cursorColor`；iOS 的 `tintColor` 取自 `selectionColor`，两个都要给。
  - `editable={false}` 的假输入框（如文章底栏、评论区入口）不需要。
- 主色只有 `Colors.primary` (#6680ff)，亮暗主题一致，取 `useTheme()` 的 `colors.primary`。

## 图片 / 视频

- 相册选图 `quality` 必须给 `1`：`expo-image-picker` 在 `quality < 1` 时
  Android 会解码成位图重压，GIF 只保留首帧。压缩统一走
  `lib/uploadImage.ts` 的 `prepareContentImage`（内部跳过 GIF）。
- 视频抽帧必须串行（`lib/video.ts` 的 `extractVideoFrames`），并发抽帧会
  在 Android 上 OOM / SIGSEGV。
- `VideoView` 在 sheet 内必须用 `surfaceType="textureView"`，否则 SurfaceView
  会盖住圆角与浮层控件。

## 打开 BottomSheet

- 面板打开前先 `KeyboardController.dismiss()`（`app/publish/index.tsx` 的
  `dismissKeyboardBeforeSheet()`），否则键盘会把面板顶到上沿。
