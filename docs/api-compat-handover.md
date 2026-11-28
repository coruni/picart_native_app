# 前端对接交接单（openapi 第四版）

> 对应仓库根目录 `openapi.json`。本轮之后 `types/compat.ts` **整个删掉了**，前端只剩 `api/compat.ts` 一处补丁，`npx tsc --noEmit` 0 错误。
> 生成客户端走 `npm run openapi`，它会先跑 `scripts/patch-openapi.mjs` 修掉 spec 里的必填 header（见第三节 1），再调生成器。
> 本文分三块：**① 本轮补齐了什么**、**② 还缺什么（要后端补）**、**③ spec 自身的结构问题**。

---

## 一、本轮补齐了什么（上一版所有降级都恢复了）

| 能力 | 接口 / 字段 | 前端位置 |
| --- | --- | --- |
| 评论内嵌文章 | `DtoCommentDto.article`（`DtoCommentArticleBriefDto`） | `components/profile/CommentCard.tsx`、`app/comment/[id].tsx` |
| 回复显示「@被回复人」 | `DtoCommentDto.parent`（`DtoCommentParentBriefDto.author`） | `components/comment/CommentReplyItem.tsx`、`CommentDetailReplyItem.tsx` |
| 个人主页装扮 | `DtoUserProfileDto.equipped_decorations` / `is_followed` | `app/(tabs)/profile.tsx`、`app/user/[id].tsx` |
| 关注 / 粉丝列表按钮初始态 | `DtoUserDto.is_followed` | `app/follows/[id].tsx`、`components/profile/followedCard.tsx` |
| 首页装扮活动卡片 | `DtoDecorationActivityDto.article` / `decoration` | `components/home/Activity.tsx` |
| 装饰页「已拥有 / 装备中 / 未解锁」 | `DtoDecorationDto.is_owned` / `is_using` / `required_likes` / `required_comments` | `app/settings/decoration.tsx`、`components/decoration/DecorationCard.tsx` |
| 评论区排序 | `GET /comment/article/{id}` 的 `sort_by` | `components/comment/ArticleCommentList.tsx` |
| 通行证 ID 展示 | `DtoUserProfileDto.nick_id_str`（uuid 主键不再对外露） | `app/(tabs)/profile.tsx`、`app/user/[id].tsx` |
| 分类级别「全部已读」 | `POST /message/read-all` 的 `type` | `components/message/MessageCategoryList.tsx` |
| 注册直接拿到登录态 | `POST /user/register` 响应即登录结果（`token` / `refresh_token` / `certification`），header 也不再必填 | `app/auth/index.tsx`（`finishAuth`） |
| 登录响应带认证信息 | `DtoLoginResultDto.certification` | 同上 |

> 上一版已恢复的（话题 / 圈子 / 搜索排序、服务端搜索、浏览历史顺序、消息分类、私聊翻页、通知与隐私开关读写、注册邀请码）保持不变。

顺带清掉的临时手段：

- **`types/compat.ts` 已删除**：`UserProfileView` / `UserView` / `CommentView` / `ActivityView` / `RegisterResultView` 等占位类型全部换成生成的 `DtoUserProfileDto`、`DtoUserDto`、`DtoCommentDto`、`DtoDecorationActivityDto`、`DtoLoginResultDto`，13 个引用文件改完。
- `void 参数` 占位清零：`sortByParam(...)`、`messageControllerMarkAllAsRead(type)` 都真的传了；热词接口仍没有 `limit`，改成本地 `slice(0, HOT_LIMIT)`（见二.2）。
- `/user/register` 的小写 `device-id` header 由 `scripts/patch-openapi.mjs` 在生成前自动改成可选，body 回到第一个参数，注册调用从 `register(deviceId, body)` 收回 `register(body)`，`getDeviceId()` 不再需要在页面里调（client 的默认 header 已经带了）。`openapi.json` 保持后端原样，见第三节 1。
- 装饰页映射层只填本体字段的写法改掉了，`is_owned` 是 `*bool`，所以按「有值就用、没值当没有归属语境」处理。
- `api/compat.ts` 仍是 5 个函数：`sendVerificationCode`、`changePassword`、`resetPassword`、`sendSmsCode`、`smsLogin`。
- API 字段相关的 `as unknown as` 断言全部去掉；剩下的 2 处是 socket payload / 上传 Blob 的运行时桥接，与 spec 无关。

**浏览历史不需要额外主键**：一条记录对应一篇文章，看多次记在 `view_count` 里，所以 `article_id` 就是唯一键，单条删除 `DELETE /article/browse/{article_id}` / 批量删除 `POST /article/browse/batch-delete` 都按它来。前端已按这个模型去重。历史页目前只有「清空」，没有做单条删除 UI。

---

## 二、还缺什么（按影响排序）

### 1. 5 个接口没有 requestBody（还在，影响最大）

`POST /auth/sms/login`、`POST /auth/sms/send` 的 DTO 已经在 components 里（`dto.SmsLoginRequest{phone, code}`、`dto.SmsCodeRequest{phone, scene}`），但 spec 没声明 `requestBody`，生成器把 body 吞成了第一个 header 参数。

- 前端位置：`api/compat.ts` 的 `smsLogin` / `sendSmsCode` 手动补 body。
- 同样缺 body 的还有 `userControllerSendVerificationCode`（`DtoEmailCodeRequest`）、`userControllerChangePassword`（`DtoChangePasswordRequest`）、`userControllerResetPassword`（`DtoResetPasswordRequest`），一共 5 个。
- 发码 / 短信登录入口：`app/auth/index.tsx` 的「短信登录」已写好，但用 `SMS_LOGIN_ENABLED = false` 关着，后端开通后翻成 `true` 即可。

### 2. 热词接口没有 `limit`

`GET /article/hot-search` 只返回全量热词，没有 `limit`。

- 前端位置：`app/search/index.tsx`，现在 `slice(0, HOT_LIMIT)` 本地截前 5 条。
- 需要：加 `limit`（`integer`）。热词表变大后，一次拉全量纯属浪费流量。

### 3. `/config/public` 仍是分组结构

`{ site: {...}, upload: {...} }`。前端在 `store/configStore.ts` 摊平一层，能用；如果以后要改扁平，提前说一声，两边一起改。

---

## 三、spec 自身的结构问题（请后端修）

> 25 个重复 `operationId` 已修好（`operationId` 334 个、零重复），`package.json` 的 `--skip-validate-spec` 已经去掉，客户端现在按正常校验生成。

### 1. `/user/register` 的小写 `device-id` header 仍是必填（前端已自动兜住）

`POST /user/register` 同时声明了 `device-id`（小写）和 `Device-Id` 两条 header，小写那条是**必填**，于是 body 被挤到第二个参数：`register(deviceId, body, …)`。

- 前端做法：加了个 `scripts/patch-openapi.mjs`，在生成前把它改成可选再喂给生成器（产物是 git 忽略的 `.openapi.patched.json`），`openapi.json` 本身不改。这样后端每次重新导出都不用前端手工修一遍。设备号由 `api/client.ts` 的 `buildDefaultHeaders` 统一带，实际请求里 `device-id` + `Device-Id` 都还在。
- 还是建议后端注解里标成可选，或直接删掉小写那条、只留 `Device-Id`——两条同名不同大小写的 header 本身就是多余的。

### 2. 列表包装字段名不统一

- 分页接口：`{ list, meta }`（`article` / `comment` / `user` / `message` / `tag` / `decoration/activities`）
- 会话列表 `DtoConversationListDto`：`{ data, meta }`
- 私聊历史 `DtoPrivateHistoryDto`：`{ data, meta }`

前端只能按接口分别取值。建议统一成 `list`。

### 3. `page` / `limit` 的类型不统一

| 接口 | 类型 |
| --- | --- |
| `/article`、`/message`、`/user`、`/comment/article/{id}` | `integer` |
| `/comment/user/{user_id}`、`/tag`、`/search/tags`、`/search/users` | `string` |

前端一律 `String()` 传，能用但别扭。建议统一 `integer`。

### 4. `sort` / `sort_by` 的合法取值没有枚举

- `GET /article` 的 `sort`：只写了 `example(latest)`，前端传的是 `latest` / `popular`（话题页、圈子页）。
- `GET /search` 的 `sort_by`：只写了 `example(relevance)`，前端传的是 `relevance` / `latest` / `views` / `likes`。
- `GET /comment/article/{id}` 的 `sort_by`：这次新加的，`description` 只写「排序方式（置顶恒在最前）」，**一个候选值都没写**。前端按上一版交接单的建议传 `hot` / `oldest` / `latest`（「全部」不传），但这三个词是我方猜的，后端实现认不认没法确认。
- `GET /collection`、`GET /tag` 的 `sort` / `sort_by` 同理。

**这些值是否都认，请给个 enum。** 如果 `popular` 实际叫 `hot`，前端改一行就行 —— 但现在没法确认，万一后端静默回退到默认排序，用户只会觉得「排序坏了」。评论排序尤其明显：切了跟没切一样。

### 5. socket 事件仍然没有定义

`lib/message-socket.ts` 的类型是按 REST 字段推断的，spec 里查不到 socket 事件。目前依赖这些 key：

- 消息对象：`message_kind`、`is_read`、`is_recalled`、`recalled_at`、`recall_reason`、`sender_id`、`receiver_id`、`created_at`、`conversation_id`
- 会话推送：`counterpart_id`、`latest_message`、`unread_count`、`last_message_at`
- 分页 meta：`has_more`、`next_cursor`

如果服务端下发的是 camelCase，聊天页会解析不出内容。**请给一份 socket 事件定义，或明确回复「与 REST 一致」。**

### 6. 登录类响应都是内联 `allOf`，生成出来的类型名不可读

`/user/login`、`/user/register`、`/auth/sms/login`、三个 OAuth 回调的 200 都是同一个内联结构（`dto.ResponseBody` + `data: dto.LoginResultDto`）。生成器给每个操作各起一个名字，于是「注册拿到的登录态」类型叫 `QqOAuthControllerWebCallback200Response` —— 内容没错，但看类型名完全猜不到这是什么。

- 建议：在 `components/responses` 里抽一个具名响应（如 `LoginResultResponse`），八个接口统一 `$ref` 过去。这样生成出来是 `LoginResultResponse`，前端 `res.data.data` 的类型一眼能对上。

---

## 四、前端兼容层位置（就剩这些）

| 位置 | 现在还留着什么 | 收尾动作 |
| --- | --- | --- |
| ~~`types/compat.ts`~~ | **已删除**，六个占位类型全部由生成的 `Dto*` 接替 | — |
| `api/compat.ts` | 5 个手动补 body：`sendVerificationCode`、`changePassword`、`resetPassword`、`sendSmsCode`、`smsLogin` | spec 补 `requestBody` 后整个文件删掉 |
| `scripts/patch-openapi.mjs` | 生成前把 `/user/register` 的 `device-id` 改成可选，产物 `.openapi.patched.json` 已 git 忽略 | 后端把该 header 标成可选（或删掉）后可整个删掉 |
| `app/search/index.tsx` | `slice(0, HOT_LIMIT)` 本地截热词 | `GET /article/hot-search` 加 `limit` 后改成传参 |
| `app/settings/decoration.tsx` | DTO → 卡片模型的映射（已填 `is_owned` / `is_using` / 门槛） | 保持即可，`*bool` 的「没值 = 没有归属语境」语义已按注释处理 |

`void 参数` 占位已经清零，不再需要单独追踪。

---

## 五、建议补齐顺序

1. **5 个 `requestBody`**（短信登录 / 发码 / 改密 / 重置密码 / 邮箱验证码，现在全压在 `api/compat.ts` 里）
2. **`sort` / `sort_by` 的 enum**（尤其是评论排序，取值纯属我方猜的）
3. **socket 事件定义**（聊天页全靠推断的字段名，camelCase 一改就白屏式失效）
4. **`/user/register` 的小写 `device-id` header**（前端已有脚本兜住，纯清理）
5. **`/config/public` 扁平化、热词 `limit`**（都不急，但都是一行的事）

---

## 六、i18n（message 改回 key）已接完，两件事想请后端定

**已接**：按 `27-i18n文案对照表.md`（337 key）生成 `locales/api/en.json` + `locales/api/zh.json`，**只取 en / zh-CN 两列**，繁中 / 日 / 韩没有进包（以后要的话改脚本里的取值下标重跑即可，代码不用动）。

- 生成器：`python scripts/gen-api-i18n.py`，默认读 `docs/i18n-source.md`，也可传表路径；产物 `locales/api/*.json` 不要手改。
- 查表入口：`lib/apiMessage.ts` 的 `translateApiMessage(raw, values?)`。查不到 key 就原样返回，所以老接口回的纯中文也不会变成空白。
- 已经接上的位置（7 处，都是原来直接把服务端原文弹给用户的）：登录 / 注册 / 找回密码（`app/auth/index.tsx`）、改密码（`account-password.tsx`）、实名认证（`account-verify.tsx`）、举报（`hooks/useReport.tsx`）、发布与上传（`app/publish/index.tsx` → `lib/uploadImage.ts` 的 `getServerErrorMessage`）。
- 后端 key 挂在 `api.*` 下，和界面自己的 `auth.login`、`auth.smsLogin` 这类文案不撞名（这边是 `api.auth.login_success`）。

**请后端定两件事：**

1. **带占位符的 38 个 key 拿不到实参**
   `message` 只有 key，没有值。比如 `category.name_exists` 回来的是「分类名已存在：%s」，前端不知道 `%s` 是什么，只能把占位符抹掉，显示成「分类名已存在」。
   建议二选一：① 响应里加 `message_args: []`，前端按顺序填；② 这类 key 明确告知前端「不要展示，自己攒文案」（现在已经是这么兜的，但得知道哪些属于这类）。
   影响最明显的是 `upload.file_too_large`（%fMB / %dMB）——现在前端不走这个 key，用自己拿到的 size 和 limit 拼文案。

2. **337 条打进包里，新 key 在旧版本上是裸 key**
   现在语言包是编译期打包的。后端加新 key 后，没升级的 App 会把 `user.some_new_thing` 原样显示出来。
   建议加一个 `GET /i18n/{lang}` 返回整份 key→文案（带 ETag），前端启动时拉一次覆盖本地包，本地包只做离线兜底。或者至少约定：**新增 key 只用于日志 / 管理端这类 App 不会展示的地方**。
