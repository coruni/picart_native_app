# 国内应用商店上架合规清单

面向华为 / 小米 / OPPO / vivo / 应用宝 / 三星的审核要求。分成「你要提供的」「代码里已经做完的」「上架前自检」三块。

---

## 一、必须由你补的信息

这些是内容而不是代码，我没有替你填（填了也是假的，审核会核营业执照）。

| 需要什么               | 用在哪                  | 填哪里                                                         |
| ------------------ | -------------------- | ----------------------------------------------------------- |
| 运营主体全称（与营业执照一致）    | 隐私政策 / 用户协议正文的「运营者」  | `locales/legal/index.ts` 的 `LEGAL_OPERATOR.company`         |
| 联系邮箱               | 同上，以及用户行使权利的联系方式     | 同上 `LEGAL_OPERATOR.email`；若服务端 `config.site_mail` 有值会优先用服务端 |
| 软件著作权证书            | 各商店「资质」一栏            | 后台提交                                                        |
| ICP 备案号 + 域名       | 商店表单必填；隐私政策需有公网可访问地址 | 后台提交                                                        |
| 隐私政策 / 用户协议公网链接    | 华为、应用宝要求填 URL        | 把 `locales/legal/zh.ts` 的正文发到官网一个页面，链接保持一致                  |
| 测试账号（能登录、能看内容）     | 审核员会实测发布/评论/注销       | 后                                                           |
| 应用截图、图标、一句话简介、内容分级 | 各商店必填                | 后台提交                                                        |

> `LEGAL_OPERATOR` 留着 `【运营主体全称】` 这种占位符，上架前必须换掉，否则审核看到方括号会直接判「材料不实」。  
> 正文改动后记得把 `locales/legal/index.ts` 的 `LEGAL_VERSION` 递增 1，已同意过旧版的用户会重新弹窗。

---

## 二、权限说明（可直接粘贴到商店后台）

**一句话总览**：本应用仅申请相机、相册（读取 / 保存）、通知、震动四项运行时权限，全部在用户主动使用对应功能时才申请，拒绝后不影响浏览。

| 权限                                                                               | 触发场景                       | 用途说明             | 用户拒绝后            |
| -------------------------------------------------------------------------------- | -------------------------- | ---------------- | ---------------- |
| 相机 `CAMERA`                                                                      | 点击「拍照」更换头像 / 主页封面、上传图片时    | 拍摄照片用于头像、封面与内容发布 | 仍可从相册选择图片        |
| 相册读取 `READ_MEDIA_IMAGES` `READ_MEDIA_VIDEO` `READ_EXTERNAL_STORAGE`(≤Android 12) | 选择图片/视频用于发帖、评论、头像、封面、认证材料时 | 读取用户主动选中的媒体文件    | 无法上传图片/视频，其余功能正常 |
| 相册写入 `WRITE_EXTERNAL_STORAGE`(≤Android 12)                                       | 在图片查看页长按选择「保存图片」时          | 把用户选中的单张图片写入系统相册 | 无法保存图片，其余功能正常    |
| 通知 `POST_NOTIFICATIONS`                                                          | 开启消息推送或在设置页打开推送开关时         | 发送私信、评论、点赞等通知    | 仅在应用内查看消息        |
| 震动 `VIBRATE`                                                                     | 点赞等交互反馈                    | 触觉反馈，不涉及个人信息     | 无影响              |
| 网络 `INTERNET`                                                                    | 全程                         | 与服务端通信           | 无法使用             |

**本应用不申请**：麦克风、通讯录、短信、通话记录、精确地理位置、悬浮窗、后台自启动、读取应用列表。

> 相册写入权限在 `AndroidManifest.xml` 里带 `android:maxSdkVersion="32"`，只对 Android 12 及以下生效；Android 13+ 通过 MediaStore 写入，不申请任何权限。`expo-media-library` 插件配了 `granularPermissions: ["photo","video"]`，因此不会带进 `READ_MEDIA_AUDIO`。iOS 侧对应 `NSPhotoLibraryAddUsageDescription`（仅「添加到相册」，不是全库读取）。
>
> 注意 `expo-media-library` 插件还会往 `<application>` 上加 `android:requestLegacyExternalStorage="true"`。当前 `android/` 是提交进仓库的，插件不会跑，manifest 里也没有这条；如果以后改用 `expo prebuild --clean` 重新生成，它会出现 —— targetSdk 35 下该属性已被系统忽略，不影响审核，但别被它吓到。

> 核对方式：打包后用 `aapt dump permissions app-release.apk`（或商店后台上传后看到的权限列表）确认没有麦克风/悬浮窗。若出现，说明某个 SDK 又把它带进来了，回到 `app.json` 的 `android.blockedPermissions` 里加。

---

## 三、第三方 SDK 清单

| SDK                      | 提供方        | 用途          | 涉及的信息          | 隐私政策                                          |
| ------------------------ | ---------- | ----------- | -------------- | --------------------------------------------- |
| Expo                     | Expo, Inc. | 应用运行框架、原生能力 | 无（不用于画像）       | <https://expo.dev/privacy>                    |
| Firebase Cloud Messaging | Google LLC | 消息推送        | 推送标识、设备型号、系统版本 | <https://firebase.google.com/support/privacy> |
| Socket.IO                | 自建（非第三方）   | 实时消息长连接     | 仅传输至自有服务器      | —                                             |

**没有接入**任何广告 SDK、行为分析 SDK、社交分享 SDK。

> 以后如果接入统计（友盟/神策）、广告（穿山甲/优量汇）、支付（微信/支付宝）、崩溃采集（Bugly），必须同时改两处：`locales/legal/zh.ts` 第三节 + 本文档这张表，否则就是「隐私政策与实际收集不符」，属于高频驳回项。

---

## 四、代码侧已经做完的

### 1. 首次启动隐私弹窗（`components/legal/PrivacyConsentGate.tsx`）

- 启动后是**居中弹窗**（遮罩压暗背景、卡片圆角），不是独立的一整页；必须点「同意并继续」才进入应用，点「不同意」弹二次确认后退出，**没有跳过的口子**。
- 弹窗内可直接阅读《用户协议》《隐私政策》全文（本地正文，不依赖网络），全文也在同一个弹窗里滚动查看，不再跳页面。
- 同意记录存 SecureStore（`lib/privacyConsent.ts`），带版本号；`LEGAL_VERSION` 变更后会重新征得同意。

### 2. 同意之前不初始化任何东西（`app/_layout.tsx`）

改造前是启动即 `hydrate()` + 建 API 客户端 + 注册通知 channel + 订阅 socket。现在只有 `consent === "agreed"` 才挂载 `ConsentedApp`，网络请求、推送、socket、设备标识符上报全部发生在同意之后 —— 这是「同意前收集设备信息」这条驳回项的直接对应修复。

### 3. 协议页不再白屏（`app/agreement/index.tsx`）

服务端 `site_privacy_policy` / `site_terms_of_service` 有内容就优先用；为空或还没拉到配置时，回落到 `locales/legal/` 的本地正文。原来 config 为空会显示「暂无内容」，审核点开就是空白页。

### 4. 账号注销入口（`app/settings/account-deletion.tsx`）

路径：设置 → 账号管理 → 注销账号（三步可达，审核会按这个深度找）。

- 查状态：`GET /user/account/deletion`
- 申请：`POST /user/account/deletion`，后端返回冷静期与预计删除时间
- 撤销：`POST /user/account/deletion/cancel`
- 已申请时页面显示「预计 YYYY-MM-DD 删除」并把主按钮换成「撤销注销申请」

### 5. 权限收敛（`android/app/src/main/AndroidManifest.xml` + `app.json`）

| 动作 | 权限                       | 原因                                                   |
| -- | ------------------------ | ---------------------------------------------------- |
| 删除 | `RECORD_AUDIO`           | 应用没有录音/录像功能，留着必被问「为什么申请麦克风」                          |
| 删除 | `SYSTEM_ALERT_WINDOW`    | 悬浮窗，release 完全不需要，属于高危权限（debug manifest 里保留，不影响开发调试） |
| 新增 | `CAMERA`                 | 代码里有 `launchCameraAsync` 拍照换头像/封面，之前没声明，真机上点「拍照」会失败  |
| 新增 | `WRITE_EXTERNAL_STORAGE`(`maxSdkVersion=32`) | 长按图片可「保存图片」，Android 12 及以下写相册需要；13+ 不需要，所以限死上限版本 |

`app.json` 里同步写了 `android.blockedPermissions` 和 `android.permissions`，重新 prebuild 也不会把这几个权限带回来；`expo-image-picker` 插件加了 `microphonePermission: false`；`expo-media-library` 插件把 `granularPermissions` 限定为 `["photo","video"]`，避免带进 `READ_MEDIA_AUDIO`。

### 6. iOS 权限文案（`app.json` → `ios.infoPlist`）

补了 `NSCameraUsageDescription`，并把 `NSPhotoLibraryUsageDescription` 从「评论上传」改成覆盖头像/封面/发布的表述；另外补了 `NSPhotoLibraryAddUsageDescription`（长按保存图片用，只申请「添加到相册」）。上架 App Store 时这几条必须写清楚用途，否则直接拒。

### 7. 权限申请时机（原本就合规，未改动）

| 位置                                              | 时机                              |
| ----------------------------------------------- | ------------------------------- |
| `components/media/ImageCropperSheet.tsx`        | 点「拍照」/「从相册选择」时才申请               |
| `app/publish/index.tsx`                         | 点「添加图片/视频」时才申请                  |
| `components/publish/ArticleRichTextToolbar.tsx` | 编辑器里点插入图片时才申请                   |
| `app/settings/account-verify.tsx`               | 点「添加证明材料」时才申请                   |
| `lib/push.ts`                                   | 只在用户主动开推送时弹权限框，启动时仅静默刷新已有 token |

### 8. 撤回同意入口（`app/settings/privacy.tsx`）

设置 → 隐私设置 → 底部「撤回隐私政策同意」。确认后删本地同意记录，并通过 `subscribeConsentCleared` 通知根布局，**当场退回隐私弹窗**（不是下次启动才生效），符合「提供撤回同意途径」的要求。

---

## 五、上架前自检（照着走一遍）

1. **卸载重装** → 首屏必须是隐私弹窗，点不同意 → 退出；重新打开 → 仍然弹。
2. **同意后**再看首页，确认能正常加载（同意链路没把初始化搞坏）。
3. **权限**：进相册选图、拍照、长按图片保存、开推送，各触发一次，确认只在操作时弹系统权限框；到系统设置里关掉相册权限，再选图/再保存应给出提示而不是崩溃。
4. **注销**：设置 → 账号管理 → 注销账号 → 申请 → 显示预计删除日期 → 撤销 → 恢复未申请。
5. **撤回同意**：设置 → 隐私设置 → 撤回隐私政策同意 → 应立刻回到隐私弹窗，且后台不再发请求。
6. **协议**：断网状态下打开「设置 → 关于 → 用户协议/隐私政策」，应显示本地正文而不是空白。
7. **打包产物核对权限**：`aapt dump permissions app-release.apk`，对照第二节列表。
8. **文案核对**：`LEGAL_OPERATOR` 已换成真实主体与邮箱；隐私政策正文里的第三方 SDK 清单与实际依赖一致。

---

## 六、审核常见驳回项对照

| 驳回说法                      | 处理                                     |
| ------------------------- | -------------------------------------- |
| 未在首次运行时以弹窗等显著方式提示用户阅读隐私政策 | 已做（PrivacyConsentGate）                 |
| 未经同意收集设备信息 / 提前初始化 SDK    | 已做（同意前不挂载任何初始化逻辑）                      |
| 申请权限未说明用途、或申请与功能无关的权限     | 已做（删麦克风/悬浮窗，补相机与限版本的写存储；用途见第二节）       |
| 未提供账号注销渠道                 | 已做（设置 → 账号管理 → 注销账号）                   |
| 隐私政策链接无法访问 / 内容为空         | 已做（本地兜底）                               |
| 隐私政策未列明第三方 SDK            | 已做（正文第三节 + 本文档第三节）                     |
| 缺少未成年人保护条款                | 已做（正文第七节，14 周岁以下需监护人同意）                |
| 未提供撤回同意的途径                | 已做（设置 → 隐私设置 → 撤回隐私政策同意，当场回到弹窗）        |
| 强制索权、拒绝后无法使用              | 相机/相册/通知都可拒绝，浏览不受影响；仅隐私政策本身拒绝即退出，属允许情形 |
