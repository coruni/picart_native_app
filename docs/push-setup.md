# Expo Push 接入说明

客户端接入已完成，剩下的是**凭据**与**后端接口**两件事。
本文档按「现在能跑什么 → 还缺什么 → 怎么补 → 怎么验证」组织。

## 1. 已完成的部分

| 文件 | 职责 |
| --- | --- |
| [`lib/push.ts`](../lib/push.ts) | 权限申请、取 Expo token、本地持久化、前台展示策略、点击跳转 |
| [`hooks/usePushNotifications.ts`](../hooks/usePushNotifications.ts) | 登录后自动注册、token 轮换、退出登录解绑、冷启动补跳转 |
| [`app/_layout.tsx`](../app/_layout.tsx) | 启动即注册前台处理器（`configurePushNotifications`） |
| [`app/settings/push.tsx`](../app/settings/push.tsx) | 设置页展示权限状态、复制 token、手动重取 |
| [`app.json`](../app.json) | `expo-notifications` 插件、`POST_NOTIFICATIONS` 权限、通知图标/颜色/渠道 |

行为约定：

- **启动不弹权限框**，只在已授权时静默刷新 token；用户进入「设置 → PUSH设置」点「通知权限」时才申请。
- 前台收到推送时，按 payload 的 `type` / `notificationType` 匹配本地 5 个开关（评论 / 点赞 / 关注 / 推荐 / 关注的人），关掉的类型不弹横幅、不进通知中心。
- 点击通知按 payload 字段跳转，优先级：
  `commentId` → 评论详情；`articleId` / `targetType=article` → 文章；`targetType=user` → 用户主页；
  `targetType=chat|message|private` → 私信；`targetType=topic` → 话题；`targetType=system|broadcast` → 系统消息；兜底 → 通知列表。
- 支持冷启动（App 被通知拉起）后补跳转。

## 2. 还缺什么

### 2.1 Android：FCM 凭据（必需）

Expo Push 在 Android 上通过 FCM 下发，没有 `google-services.json` 时 `getExpoPushTokenAsync` 会直接报错。

1. 打开 [Firebase Console](https://console.firebase.google.com/) 新建项目（或复用现有项目）。
2. 添加 Android 应用，包名填 `com.cerylab.app`（与 `app.json` 的 `android.package` 一致）。
3. 下载 `google-services.json`，放到仓库根目录。
4. 在 `app.json` 的 `android` 字段里加一行：

   ```json
   "googleServicesFile": "./google-services.json"
   ```

5. 重新生成原生工程并构建：

   ```bash
   npx expo prebuild --platform android --clean
   npx expo run:android
   ```

> `google-services.json` 属于凭据文件，建议只在本地/EAS secret 中保存，不要提交到公开仓库。
> 若使用 EAS Build，也可以把它上传为 secret file，具体见 EAS 文档。

### 2.2 iOS：APNs 凭据（必需）

1. 确保 Apple Developer 账号是付费账号（免费账号不能开推送）。
2. 用 EAS 托管凭据（推荐）：

   ```bash
   npx eas-cli credentials
   # 选择 iOS → 对应 bundle id → Push Notifications → 上传 .p8（Key ID / Team ID 一并提供）
   ```

3. 或者直接在 `eas.json` 构建时由 EAS 引导生成。
4. 构建 iOS dev build：`npx expo run:ios` 或 `eas build -p ios --profile development`。

### 2.3 后端：设备token 注册接口（客户端已留好开关）

目前 `lib/push.ts` 里 `PUSH_REGISTRATION_ENABLED = false`，token 只落在本地（SecureStore），不发请求，避免 404 噪音。

后端补上接口后，把这个常量改成 `true` 即可自动注册。约定的契约：

```http
POST /user/push/devices
Authorization: Bearer <token>
device-id: <deviceId>
Content-Type: application/json

{
  "deviceId": "…",
  "provider": "expo",
  "platform": "android",
  "token": "ExponentPushToken[xxxx]",
  "appVersion": "1.0.0"
}
```

```http
DELETE /user/push/devices/:deviceId
```

服务端还需要：

- 发送前过滤用户的通知开关（`enablePushNotification` 等 11 项）与免打扰
- 处理 Expo 返回的 `DeviceNotRegistered`（删除失效 token）
- 在评论 / 点赞 / 关注 / 私信 / 公告等触发点调用 `https://exp.host/--/api/v2/push/send`

## 3. 验证步骤

1. 用 **真机** 安装 development build（Expo Go 在 Android 上已不支持远程推送；代码里也用 `Device.isDevice` 拦掉了模拟器）。
2. 登录后进入「设置 → PUSH设置」：
   - 「通知权限」显示「未申请」→ 点击，系统弹授权框，允许后变为「已开启」
   - 稍等片刻，「推送 Token」出现内容，点击可复制
3. 用复制的 token 发一条测试推送：

   ```bash
   curl -X POST https://exp.host/--/api/v2/push/send \
     -H "Content-Type: application/json" \
     -d '{
       "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
       "title": "评论通知",
       "body": "有人评论了你的作品",
       "data": {
         "type": "comment",
         "targetType": "article",
         "targetId": 123,
         "articleId": 123
       }
     }'
   ```

4. 依次验证四种场景：App 在前台（弹横幅）、切后台、杀进程、点击通知（应跳到对应文章页）。
5. 回到设置页关掉「评论我」，再发同样的推送，确认前台不再弹横幅。

## 4. 常见错误对照

| 设置页提示 | 原因 | 处理 |
| --- | --- | --- |
| 缺少 FCM 配置（google-services.json） | Android 没有 FCM 凭据 | 按 2.1 配置 |
| 缺少 APNs 推送凭据 | iOS 没有推送证书/Key | 按 2.2 配置 |
| Expo Go 不支持 Android 远程推送 | 用了 Expo Go | 改用 development build |
| 模拟器无法接收远程推送 | `Device.isDevice === false` | 换真机 |
| 缺少 EAS projectId | `app.json` 的 `extra.eas.projectId` 缺失 | 补上 projectId |

## 5. 后续（国内上架前）

- 国内 Android 上 FCM 不可达，必须接厂商通道（华为 / 小米 / OPPO / vivo / 荣耀）或极光、个推等聚合服务。
- 推送 SDK 必须在用户同意隐私政策后再初始化，并在隐私政策里声明，否则应用商店审核不通过。
- 各厂商通道通常需要原生 SDK + config plugin，届时把 `lib/push.ts` 的 `provider` 从 `expo` 切到对应通道即可，上层逻辑不变。
