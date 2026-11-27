# 前端对接交接单（openapi 第二版）

> 对应仓库根目录 `openapi.json`（camelCase → snake_case、ID number → string、响应包装 `data.data.list` → `data.list`）。
> 前端已完成全量适配，`npx tsc --noEmit` 无错误，App 可正常跑。
> 本文只列**后端还需要补的东西**，以及每处前端是怎么临时兜住的——补齐后按「收尾清单」删占位即可。

---

## 一、本次后端变更（前端已适配，无需后端处理）

| 变更 | 前端处理 |
| --- | --- |
| 字段全面 snake_case | 全部读写改蛇形，包括请求体 DTO |
| 所有 ID 由 number 改 string（UUID） | `Number(id)` 比较、`Set<number>`、`keyExtractor` 全量改 string；临时新消息 ID 改用 `local-` 前缀而非负数 |
| 列表包装 `data.data.list` → `data.list` | 取值统一改 `res.data?.list` |
| 游标分页统一 `has_more` / `next_cursor` | 会话列表、私聊消息等按游标翻页 |

⚠️ **字段名/类型不统一的地方**（不阻塞，但建议统一下，否则前端只能按接口逐个区分）：

1. **列表字段名不一致**：分页接口是 `{ list, meta }`（如 `articleControllerFindAll`），但会话列表 `DtoConversationListDto` 是 `{ data, meta }`。
   建议统一成 `list`。
2. **page / limit 类型不一致**：`articleControllerFindAll`、`messageControllerFindAll`、`userControllerFindAll` 的 page/limit 是 `number`；
   `commentControllerGetUserComments` 的 page/limit 是 `string`。建议统一 `number`。
3. **`/config/public` 按 group 分组返回**（`{ site: {...}, upload: {...} }`）。前端已在 `store/configStore.ts` 里摊平一层，若后端改成扁平结构，摊平逻辑要一起删（否则读不到值）。

---

## 二、待补齐清单

### A. 接口没声明 requestBody（生成器把 body 吞成了第一个 header 参数）

这 4 个接口 DTO 已经在 `components` 里定义，但 spec 的 `requestBody` 没写，生成的函数签名第一个参数变成了 `authorization`。

| 接口 | 现状 | 前端兜法 |
| --- | --- | --- |
| `POST /user/email/verification` | 无 body 参数 | `api/compat.ts` → `sendVerificationCode(body)` |
| `POST /user/password/reset` | 无 body 参数 | `api/compat.ts` → `resetPassword(body)` |
| `POST /user/password/change` | 无 body 参数 | `api/compat.ts` → `changePassword(body)` |
| `POST /user/profile/contact` | body 声明成了 `DtoUpdateProfileRequest`（错误的 DTO） | `api/compat.ts` → `updateContact(body)`，字段名暂按旧版 `{ email, verificationCode }` 发，**请确认到底该用哪个 DTO、字段是 `verificationCode` 还是 `verification_code`** |

### B. 请求体 DTO 缺字段

| DTO | 缺的字段 | 前端读取点 |
| --- | --- | --- |
| `DtoRegisterRequest` | `invite_code`、`verification_code` | `app/auth/index.tsx`（注册） |
| `DtoUpdateUserConfigRequest` | `watermark_enabled`；通知开关 `enable_system_notification` / `enable_comment_notification` / `enable_like_notification` / `enable_follow_notification` / `enable_message_notification` / `enable_order_notification` / `enable_payment_notification` / `enable_invite_notification` / `enable_email_notification` / `enable_sms_notification` / `enable_push_notification`；隐私开关 `hide_comments` / `hide_favorites` / `hide_collections` / `hide_followers` / `hide_followings` / `hide_tags` | `app/settings/account.tsx`、`app/settings/notification.tsx`、`app/settings/privacy.tsx` |

> 现在 `DtoUpdateUserConfigRequest` 里只有佣金相关的 5 个字段，前端写开关时用 `as unknown as` 硬塞。

### C. 响应体缺字段

统一在 `types/compat.ts` 里用「生成 Dto & 缺失字段」的交叉类型占位，**补齐后删掉该类型、直接用生成 Dto**。

| 接口 | DTO | 缺字段 | 前端读取点 | 兼容类型 |
| --- | --- | --- | --- | --- |
| 登录 `POST /user/login` | `DtoLoginResultDto` | `config`（通知 / 隐私 / 水印开关全集） | `store/authStore.ts`、`settings/*` | `AuthUserView` |
| 用户资料 `GET /user/profile`、`GET /user/{id}` | `DtoUserProfileDto` | `config`、`equipped_decorations`、`is_followed` | `app/(tabs)/profile.tsx`、`app/user/[id].tsx`、`app/edit-profile` | `UserProfileView` |
| 用户列表 `GET /user`、关注/粉丝列表 | `DtoUserDto` | `is_followed` | `app/follows/[id].tsx`、`components/profile/followedCard.tsx`、`components/user/UserSearchCard.tsx` | `UserView` |
| 评论列表 / 评论详情 | `DtoCommentDto` | `article`（`id`/`title`/`cover`/`summary`/`author_id`/`category`）、`parent`（被回复的那条评论） | `components/profile/CommentCard.tsx`、`components/comment/*`、`app/comment/[id].tsx` | `CommentView` |
| 装饰活动 `GET /decoration/activities` | `DtoDecorationActivityDto` | `article`、`decoration`（现在只给 `article_id` / `decoration_id`） | `components/home/Activity.tsx` | `ActivityView` |
| 浏览历史 `GET /article/browse-history` | `DtoBrowseHistoryDto` | `id`、`created_at`、`updated_at`（现在只有 `article_id` / `viewed_at` / `article`） | `components/profile/HistoryTab.tsx` | `BrowseHistoryView` |

**影响说明**：

- 缺 `config` → 通知/隐私开关页只能从 store 里已有的值显示，冷启动直接进这些页面时全是关。
- 缺 `equipped_decorations` → 头像框/气泡装扮只能显示作者评论里的（`DtoAuthorBriefDto` 有，`DtoUserProfileDto` 没有），个人主页不显示自己戴的。
- 缺 `is_followed` → 别人的主页 / 关注列表无法显示「已关注」态，只能等用户点一次才准。
- 缺评论 `article` / `parent` → 「我的评论」卡片没有文章封面标题；回复列表显示不出「回复 @谁」。
- 缺活动 `article` / `decoration` → 活动卡片没有封面，点不进去文章。
- 缺历史 `id` → 前端用 `article_id@viewed_at` 拼了个临时 key 去重（可能重复文章同日多条会合并）。

### D. 接口缺查询参数

| 接口 | 缺的参数 | 前端现状 | 读取点 |
| --- | --- | --- | --- |
| `GET /article` | `sort` | 话题页 / 圈子页排序失效，参数直接丢掉（`void sortMode`） | `app/topic/[id].tsx`、`app/(tabs)/circle/index.tsx` |
| `GET /search/articles` | `sort_by`、`category_id` | 搜索页排序、分类筛选失效（`void sort; void categoryId;`） | `app/search/index.tsx` |
| `GET /article/browse-history` | `order`（newest / oldest） | 只在本地切顺序，翻页后顺序会错乱 | `components/profile/HistoryTab.tsx` |
| `GET /message` | `type`（通知 / 系统消息） | 拉全量再本地 `filter`，消息多时白拉流量 | `components/message/MessageCategoryList.tsx`、`app/notification/index.tsx`、`app/system-message/index.tsx` |
| `PUT /message/read-all` | `type` | 点「全部已读」会把系统消息一起标掉 | `app/notification/index.tsx` |
| `GET /message/private/conversations/{user_id}/messages` | `cursor`、`limit` | 只拉第一页，翻页能力没了 | `app/chat/[id].tsx` |
| `GET /comment/{id}` | `page`、`limit`（针对 `replies`） | 一次返回全部回复，前端不再翻页（大评论区首屏变慢） | `app/comment/[id].tsx` |
| `GET /tag` | `keyword` | 话题搜索 / 话题选择器改成「拉全量 + 本地过滤」 | `app/search/index.tsx`、`components/publish/TopicPickerSheet.tsx` |
| `GET /search/tags`、`GET /search/users` | 端点不存在 | 分别用 `tagControllerFindAll()` 全量 + `userControllerFindAll(page, limit, keyword)` 顶 | `app/search/index.tsx` |

> 如果 `/search/tags`、`/search/users` 是有意下线的，请回复一声，前端把这两块改成「只搜文章」的 UI，就不用维护本地过滤了。

### E. socket 事件字段（需要后端确认）

`lib/message-socket.ts` 里的类型是**按 REST 的 snake_case 推断**的，spec 里没有 socket 事件定义，无法核对。目前按下面这些 key 解析：

- 消息对象：`message_kind`、`is_read`、`is_recalled`、`recalled_at`、`recall_reason`、`sender_id`、`receiver_id`、`created_at`
- 会话推送：`conversation_id`、`counterpart_id`、`latest_message`、`unread_count`、`last_message_at`
- 分页 meta：`has_more`、`next_cursor`

**如果服务端下发的还是 camelCase，聊天页会解析不出消息内容 / 已读态。** 请给一份 socket 事件的字段定义（或者确认与 REST 一致）。

---

## 三、前端兼容层在哪（补齐后按这里删）

| 文件 | 作用 | 收尾动作 |
| --- | --- | --- |
| `types/compat.ts` | 缺字段的占位类型（`AuthUserView` / `UserProfileView` / `UserView` / `CommentView` / `ActivityView` / `BrowseHistoryView`） | 逐个删类型，引用的地方改用生成的 `Dto*` |
| `api/compat.ts` | 补 4 个接口的 requestBody（见 A 段） | 整个文件删掉，直接调 `api.userControllerXxx` |
| `as unknown as` 占位 | `app/auth/index.tsx`（注册带邀请码）、`app/settings/account.tsx`（水印）、`app/settings/privacy.tsx`（隐私开关） | DTO 补全后删掉断言 |
| `void xxx` 占位 | `app/search/index.tsx`、`app/topic/[id].tsx`、`app/(tabs)/circle/index.tsx`、`components/profile/HistoryTab.tsx` | 后端接参数后把值传进去 |
| 本地过滤逻辑 | `MessageCategoryList` / `notification` / `system-message` 按 `type` 筛；`search` 的话题/用户本地筛 | 后端给参数后删过滤 |
| `store/configStore.ts` 的 `flattenGroups` | 摊平 `/config/public` 的 group 结构 | 后端若改扁平，删掉摊平 |

---

## 四、建议补齐顺序（按对用户的影响排）

1. **socket 事件字段确认**（E 段）—— 不确认聊天基本不能用。
2. **`DtoCommentDto.article` / `parent`**（C 段）—— 「我的评论」、回复列表是高频页面。
3. **`config` 相关**（B 段 + C 段）—— 通知/隐私开关现在保存不上。
4. **`DtoUpdateUserConfigRequest` 补开关字段** —— 同上。
5. **`equipped_decorations` / `is_followed`**（C 段）—— 装扮与关注态。
6. **4 个 requestBody**（A 段）—— 改密码、重置密码、换邮箱、发验证码。
7. **分页/排序参数**（D 段）—— 体验问题，不阻塞。
8. **`DtoRegisterRequest` 的邀请码 / 邮箱验证码** —— 邀请注册场景才用。
