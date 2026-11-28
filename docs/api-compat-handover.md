# 前端对接交接单（openapi 第三版）

> 对应仓库根目录 `openapi.json`（本次补齐了大批字段与查询参数）。
> 前端已重新生成客户端并全量对接，`npx tsc --noEmit` 0 错误。
> 本文分三块：**① 这次前端把哪些降级恢复了**、**② 还缺什么（要后端补）**、**③ spec 自身的结构问题**。

---

## 一、这次恢复了什么（上一版被降级的功能，现在按后端参数实现）

| 能力 | 接口 / 参数 | 前端位置 |
| --- | --- | --- |
| 话题页 / 圈子页排序 | `GET /article` 的 `sort` | `app/topic/[id].tsx`、`app/(tabs)/circle/index.tsx` |
| 搜索页排序 + 分类筛选 | `GET /search` 的 `category_id` / `sort_by` | `app/search/index.tsx` |
| 话题搜索走服务端 | `GET /search/tags` 的 `keyword` + 分页 | `app/search/index.tsx` |
| 用户搜索走服务端 | `GET /search/users` 的 `keyword` + 分页 | `app/search/index.tsx` |
| 发布页话题选择器搜索 | `GET /search/tags` 的 `keyword` | `components/publish/TopicPickerSheet.tsx` |
| 浏览历史正序 / 倒序 | `GET /article/browse/history` 的 `order` | `components/profile/HistoryTab.tsx` |
| 通知 / 系统消息分类 | `GET /message` 的 `type` | `components/message/MessageCategoryList.tsx` |
| 私聊消息翻页 | `GET /message/private/conversations/{id}/messages` 的 `cursor` / `limit` | `app/chat/[id].tsx` |
| 评论详情回复翻页 | `GET /comment/{id}` 的 `page` / `limit` | `app/comment/[id].tsx` |
| 通知 / 隐私 / 水印开关**读写** | `DtoUserConfigDto` + `DtoUpdateUserConfigRequest` / `DtoUpdateNotificationRequest` | `app/settings/notification.tsx`、`privacy.tsx`、`account.tsx` |
| 注册带邀请码 / 邮箱验证码 | `DtoRegisterRequest.invite_code` / `verification_code` | `app/auth/index.tsx` |
| 改邮箱 | `POST /user/profile/contact` 现在有 `DtoUpdateContactRequest` body | `app/settings/account-email.tsx` |

顺带清掉的临时手段：

- `types/compat.ts` 里的 `UserConfigView` / `EquippedDecorationView` / `AuthUserView` 全删了，改用生成的 `DtoUserConfigDto`、`DtoEquippedDecorationDto`、`DtoLoginResultDto`。
- `api/compat.ts` 从 4 个函数减到 3 个（`updateContact` 已删，直接调 `api.userControllerUpdateContact`）。
- API 字段相关的 `as unknown as` 断言全部去掉；剩下的 2 处是 socket payload / 上传 Blob 的运行时桥接，与 spec 无关。

---

## 二、还缺什么（按影响排序）

### 1. 评论上没有 `article` 和 `parent`（影响最大）

`DtoCommentDto` 只有 `article_id`、`parent_id`、`root_id`，没有内嵌对象。前端需要：

| 字段 | 用途 | 前端位置 |
| --- | --- | --- |
| `article`（`id` / `title` / `cover` / `summary` / `author_id` / `category`） | 「我的评论」卡片要显示文章封面、标题、分类；从评论通知进详情时要定位文章 | `components/profile/CommentCard.tsx`、`app/comment/[id].tsx` |
| `parent`（被回复的那条评论，至少带 `author.nickname`） | 回复列表要显示「回复 @某某」；现在只能不显示 @ | `components/comment/CommentReplyItem.tsx`、`CommentDetailReplyItem.tsx` |

现状：`types/compat.ts` 的 `CommentView` 占位，取不到就不渲染。
**建议在 `GET /comment/article/{id}`、`GET /comment/user/{user_id}`、`GET /comment/{id}` 三处都补 `article`；`parent` 至少在回复列表补。**

### 2. 用户资料上缺 `equipped_decorations` 和 `is_followed`

`DtoUserProfileDto` 有 `config` 了（👍），但仍然：

| 缺字段 | 用途 | 前端位置 |
| --- | --- | --- |
| `equipped_decorations` | 个人主页要显示自己戴的头像框 / 评论气泡 | `app/(tabs)/profile.tsx`、`app/user/[id].tsx` |
| `is_followed` | 别人主页「已关注 / 关注」按钮的初始态 | `app/user/[id].tsx` |

> spec 里 `equipped_decorations` 的注释已经写了「AuthorBriefDto 同样声明了 equipped_decorations 却全仓无填充点」—— 说明这个字段目前是**声明了没人填**，把两个 DTO 的装配逻辑一次补齐最省事。

### 3. 用户列表项缺 `is_followed`

`GET /user`、`GET /user/{id}/followers`、`GET /user/{id}/following` 的元素是 `DtoUserDto`，没有 `is_followed`；而 `dto.UserSearchItemDto` 有。

- 影响：关注 / 粉丝列表的按钮全部显示「未关注」，用户点一次才准。
- 前端位置：`app/follows/[id].tsx`、`components/profile/followedCard.tsx`。
- 建议：给 `DtoUserDto` 加 `is_followed`（列表接口按当前登录用户批量算），或把这几个接口的元素类型换成 `DtoUserSearchItemDto`。

### 4. 装饰活动缺内嵌 `article` / `decoration`

`DtoDecorationActivityDto` 只有 `article_id` / `decoration_id`，首页「活动」卡片拿不到封面，也点不进文章。

- 前端位置：`components/home/Activity.tsx`（`types/compat.ts` 的 `ActivityView` 占位）。
- 需要：`article`（至少 `id` / `title` / `cover` / `images` / `summary`）、`decoration`（至少 `image_url`）。

### 5. 装饰列表缺归属 / 装备状态

`GET /decoration` 返回 `DtoDecorationDto`，没有下面这些，而装饰页要用来区分「已拥有 / 装备中 / 未解锁」：

- `is_owned`（或 `can_direct_equip`）
- `is_using`
- `required_likes` / `required_comments`（解锁门槛文案）

前端位置：`app/settings/decoration.tsx`、`components/decoration/DecorationCard.tsx`。
现状：前端把 DTO 映射成卡片模型，只填了本体字段（`image_url` / `bubble_color` / `rarity` / `sort`），**所有装饰都显示成未解锁**。
建议：这个接口带上登录用户语境，把归属状态一起给。

### 6. 浏览历史缺主键

`DtoBrowseHistoryDto` 只有 `article_id` / `viewed_at`，没有 `id`。

- 影响：列表去重和 `keyExtractor` 只能用 `article_id@viewed_at` 拼，同一篇文章在同一天看两次会被合并成一条。
- 前端位置：`components/profile/HistoryTab.tsx`。
- 需要：`id`（历史记录主键）；如果不打算给，请给一个明确保证唯一的组合。

### 7. 评论列表没有排序参数

`GET /comment/article/{id}` 现在只有 `page` / `limit` / `only_author`，没有 `sort_by`。

- 影响：评论区的「全部 / 最热 / 最早 / 最新」切换点了没反应（前端 `void sortByParam(...)` 占位）。
- 前端位置：`components/comment/ArticleCommentList.tsx`。
- 需要：`sort_by`，取值建议 `hot` / `oldest` / `latest`。

### 8. 全部已读接口没有 `type`

`PUT /message/read-all`（`messageControllerMarkAllAsRead`）没有参数。

- 影响：在「通知」页点全部已读，会把「系统消息」一起标掉。
- 前端位置：`components/message/MessageCategoryList.tsx`。
- 需要：`type`，只更新对应类型。

### 9. 零碎两处

- `DtoUserProfileDto.certification` 是完整的 `DtoCertificationDto`，而 `DtoLoginResultDto` 完全没有 `certification` —— 登录后进自己主页，认证标识要等 `GET /user/profile` 回来才出现。能带上 brief 版更好。
- `/config/public` 仍是 group 分组结构（`{ site: {...}, upload: {...} }`）。前端在 `store/configStore.ts` 摊平一层，能用；如果以后要改扁平，提前说一声，两边一起改。

---

## 三、spec 自身的结构问题（会挡生成，请后端修）

### 1. 25 个 operationId 重复（**必须修**）

同一批接口在 spec 里同时存在 camelCase 和 snake_case 两条 path，`operationId` 完全相同：

```
/user/certification/identity/{userId}             vs  /{user_id}
/user/profile/favorites/{productId}               vs  /{product_id}
/article/browse/{articleId}                       vs  /{article_id}          (get / delete)
/collection/article/{articleId}/info              vs  /{article_id}/info
/collection/check/{articleId}                     vs  /{article_id}
/collection/{id}/article/{articleId}              vs  /{article_id}          (post / delete)
/comment/user/{userId}                            vs  /{user_id}
/decoration/activity/claim/{activityId}           vs  /{activity_id}
/decoration/unuse/{decorationId}                  vs  /{decoration_id}
/decoration/use/{decorationId}                    vs  /{decoration_id}
/decoration/user/{userId}                         vs  /{user_id}
/emoji/packs/{id}/emojis/{emojiId}                vs  /{emoji_id}            (delete / patch)
/message/private/block/{userId}                   vs  /{user_id}             (post / delete)
/message/private/conversations/{userId}/messages  vs  /{user_id}/messages
/message/private/conversations/{userId}/read      vs  /{user_id}/read
/message/private/{userId}                         vs  /{user_id}
/order/no/{orderNo}                               vs  /{order_no}
/payment/order/{orderId}                          vs  /{order_id}
/points/tasks/my/{activityId}                     vs  /{activity_id}
/points/users/{userId}/balance                    vs  /{user_id}/balance
/points/users/{userId}/transactions               vs  /{user_id}/transactions
```

后果：`openapi-generator` 直接报 `operationId is repeated` 退出，客户端生成不了。
临时办法：`package.json` 的 `openapi` 脚本加了 `--skip-validate-spec` 才跑通 —— 这会跳过**整个** spec 校验，等于把安全网撤了。
**请后端删掉 camelCase 那 25 条 path**，删完我就把这个 flag 去掉。

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

**这些值是否都认，请给个 enum。** 如果 `popular` 实际叫 `hot`，前端改一行就行 —— 但现在没法确认，万一后端静默回退到默认排序，用户只会觉得「排序坏了」。

### 5. socket 事件仍然没有定义

`lib/message-socket.ts` 的类型是按 REST 字段推断的，spec 里查不到 socket 事件。目前依赖这些 key：

- 消息对象：`message_kind`、`is_read`、`is_recalled`、`recalled_at`、`recall_reason`、`sender_id`、`receiver_id`、`created_at`、`conversation_id`
- 会话推送：`counterpart_id`、`latest_message`、`unread_count`、`last_message_at`
- 分页 meta：`has_more`、`next_cursor`

如果服务端下发的是 camelCase，聊天页会解析不出内容。**请给一份 socket 事件定义，或明确回复「与 REST 一致」。**

---

## 四、前端兼容层位置（后端补齐后按这里删）

| 文件 | 现在还留着什么 | 收尾动作 |
| --- | --- | --- |
| `types/compat.ts` | `UserProfileView`（`equipped_decorations`、`is_followed`）、`UserView`（`is_followed`）、`CommentView`（`article`、`parent`）、`ActivityView`（`article`、`decoration`）、`BrowseHistoryView`（`id`） | 对应字段补齐后删类型，引用处改用生成的 `Dto*` |
| `api/compat.ts` | 只剩 3 个：`sendVerificationCode`、`changePassword`、`resetPassword`（这三个接口 spec 还没写 requestBody） | spec 补 `requestBody` 后整个文件删掉 |
| `void xxx` 占位 | `components/comment/ArticleCommentList.tsx` 的 `sortByParam`、`app/search/index.tsx` 的 `HOT_LIMIT` | 后端给参数后把值传进去 |
| 本地兜底 | `HistoryTab` 的 `article_id@viewed_at` 去重键 | 后端给 `id` 后换掉 |
| 映射层 | `app/settings/decoration.tsx` 的 DTO → 卡片模型（只填了本体字段） | 后端给归属状态后补 `isOwned` / `isUsing` |

---

## 五、建议补齐顺序

1. **25 条重复 path**（挡生成，也挡以后任何人重新生成）
2. **评论 `article` / `parent`**（「我的评论」、回复 @ 是高频路径）
3. **`equipped_decorations` / `is_followed`（资料 + 用户列表）**（关注按钮、装扮展示）
4. **装饰列表的归属 / 装备状态**（现在整个装饰页都是「未解锁」）
5. **`sort` / `sort_by` 的 enum**（一行文档的事，避免排序静默失效）
6. **评论 `sort_by`、`read-all` 的 `type`**
7. **活动内嵌 `article` / `decoration`、浏览历史 `id`**
8. **socket 事件定义**
