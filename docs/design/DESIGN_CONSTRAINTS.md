# PicArt Native 设计语言审阅 & 设计约束

> 版本 v1.0 · 2026-10-17
> 审阅方式：静态代码审阅（`app/`、`components/`、`constants/theme.ts`、`hooks/`）
> 适用对象：新页面、新组件、改版、以及任何由 AI 生成 UI 的任务
> 文档性质：**约束型文档**。`MUST` 为硬性要求，`SHOULD` 为默认做法（偏离需说明理由），`MUST NOT` 为禁止项。

---

## 0. 结论摘要

**风格定位：Light-first Editorial Feed（浅色内容社区）**

关键词：浅灰画布 + 纯白卡片 · 近乎零阴影 · 8–12px 柔和圆角 · 单一 periwinkle 蓝紫主色 · 高信息密度信息流 · iOS 分组列表式设置页 · 封面取色的渐变 Hero。

成熟度评估：**视觉语言已成型，但令牌层不完整**。

| 维度 | 现状 |
| --- | --- |
| 色彩体系 | 主色 + 中性色 + `danger` 齐备；`like` / `official` / `iconMuted` 仍是散落硬编码 |
| 字体 | 仅系统字体，8 级字号已定义（新增 `bodyMedium` 15），实际仍有 13 种字号 |
| 间距 | 4pt 网格基本成立，页面 gutter 存在 14 / 16 双轨 |
| 圆角 | 8 / 12 / 18 / 20 / 999 形成稳定语义，执行度高 |
| 层级 | 无卡片阴影，靠底色差 + hairline 分层，方向正确 |
| 组件化 | **变体体系已建立**（`Button` / `Badge` / `Chip`），目录按功能归类完成 |
| 暗色模式 | 已覆盖全站，层级反相**已修复**（2026-10-17） |
| 可访问性 | 主色与危险色承载文字的对比度**已修复**；次级文字灰仍待统一 |

**本轮已修复的 P0（2026-10-17）**

1. ✅ **主色对比度**：新增 `primaryFill #4C63E6`（白字 4.96:1）与 `primaryText`（亮 `#4C63E6` 4.96:1 / 暗 `#8FA2FF` 6.99:1），替换全站 60+ 处文字与实心按钮；`#6680ff` 保留给指示器、图标、光标等非文字场景。
2. ✅ **暗色分隔线**：`DarkTheme.border` 由 `#0c0f1d` 改为 `#262a3b`，hairline 在卡片上重新可见。
3. ✅ **暗色层级**：`secondaryBackground` 由 `#4a5565` 改为 `#151827`，恢复「画布 < 次级面 < 卡片」的正向层级。

**本轮已完成的组件化（2026-10-17）**

4. ✅ **变体组件**：新增 `Button`（5 variant × 3 size × 2 shape × 3 tone）、`Badge`（3 variant × 3 tone）、`Chip`（3 variant × selected），替换 7 处按钮、3 处角标、2 处胶囊。
5. ✅ **目录重组**：`ui/` 只留 11 个全局原子组件，媒体交互拆到 `media/`、富文本拆到 `rich-text/`、浮层拆到 `feedback/`；删除 2 个零引用文件。
6. ✅ **变体补齐**：`ThemedText` 增加 `bodyMedium`(15) / `primary` / `onPrimary` / `danger`，修正 `muted` 误用表面色；`ThemedIcon` 增加 `primary` / `onPrimary` / `danger`，修正 `muted` 与 `secondary` 同值。

**下一优先级**

- 语义色未令牌化：`#FF6B6B`、`#12ADB3`、`#FF3B30`、`#999999`、`#C7C7CC` 仍散落在 8+ 文件，建议提为 `like / official / destructive / iconMuted`。
- 反白场景（Hero 图上的关注按钮）需要 `onDark` tone 才能纳入 `Button` 体系。

---

## 1. 设计原则（从现有实现反推，建议正式采纳）

1. **内容优先，界面退让**
   图片与标题是主角。卡片无边框无阴影，正文区不加装饰性图形。任何新增元素先问：它是否帮助用户更快消费内容？

2. **单主色，克制使用**
   全站只有一个品牌色相（periwinkle 蓝紫），拆为三个角色：`primary` 用于指示器/图标/光标，`primaryFill` 用于承载白字的实心块，`primaryText` 用于彩色文字与链接。**MUST NOT** 引入第二个彩色作为装饰。

3. **用「面」分层，不用「影」分层**
   层级 = 底色差 + 1px hairline。全站仅 3 处阴影（Switch 滑块、弹层遮罩、Toast 底）。**MUST NOT** 给内容卡片加 `shadow*` / `elevation`。

4. **圆角表达可点性**
   媒体 = 8，可交互面 = 12，全圆 = 头像/胶囊/开关。圆角越大越「软」，用于输入与按钮；信息容器保持 12 以内。

5. **一屏一个主动作**
   登录页只有「登录」是实心主按钮；设置页只有「退出登录」有彩色底；文章页主动作固定在底部栏。

6. **图像驱动情绪**
   个人主页 / 圈子 / 话题页从封面图提取主色（`react-native-image-colors`），压暗至 24% 作为 Hero 底色。这是本项目最有辨识度的设计手法，新页面若有大图 Hero **SHOULD** 沿用。

---

## 2. 设计令牌

### 2.1 色彩

**基础色板（`constants/theme.ts`）**

| Token | Light | Dark | 用途 |
| --- | --- | --- | --- |
| `primary` | `#6680ff` | `#6680ff` | 品牌色：指示器、图标、光标、选中底（**不承载文字**） |
| `primaryFill` | `#4C63E6` | `#4C63E6` | 实心填充：主按钮、气泡、关注按钮、角标（白字 4.96:1） |
| `primaryText` | `#4C63E6` | `#8FA2FF` | 彩色文字与链接（亮 4.96:1 / 暗 6.99:1） |
| `background` | `#f8f9fd` | `#0c0f1d` | 页面画布 |
| `card` | `#ffffff` | `#1b1d2a` | 卡片 / 内容面 / 导航栏 |
| `text` / `foreground` | `#111827` | `#ededed` | 主文字 |
| `border` | `#f2f4f9` | `#262a3b` | 分隔线、输入框描边 |
| `muted` | `#f1f4f9` | `#252938` | 骨架屏块、禁用按钮底 |
| `mutedForeground` | `#6b7280` | `#9ca3af` | 次级文字（推荐） |
| `secondary` | `#00000073` | `#ffffffa6` | 次级文字 / 图标（历史值） |
| `secondaryBackground` | `#f9fafb` | `#151827` | 次级面（搜索框、资料页底） |
| `member` | `#6c5ce7` | `#6c5ce7` | 会员标识 |
| `dangerFill` | `#DC2626` | `#DC2626` | 实心危险操作：删除、拉黑（白字 4.83:1） |
| `danger` | `#DC2626` | `#F87171` | 错误提示文字（亮 4.83:1 / 暗 6.04:1） |

**主色的两个语义角色（MUST）**

- `primaryFill`：任何**承载白色文字/图标**的实心色块。白字对比度 4.96:1，亮暗一致。
- `primaryText`：任何**彩色文字或链接**。亮色用深一档的 `#4C63E6`，暗色用亮一档的 `#8FA2FF`。
- `primary`：只用于非文字元素（Tab 指示器、未读点、光标、ActivityIndicator、选中底、Hero 覆盖层）。图标对比度 3.44:1，满足 UI 组件 3:1 要求。

> 为什么必须拆成两个：暗色下「承载白字的填充」需要足够暗（L ≤ 0.18），而「深色底上的文字」需要足够亮（L ≥ 0.22），单一颜色无法同时满足。

危险色沿用同一套拆分逻辑：`dangerFill` 恒定深红承载白字，`danger` 作为文字色随底色提亮。

**透明度规则**

品牌色的浅色底一律用 hex alpha 后缀，现有 4 档，**MUST** 只使用这 4 档：

| 后缀 | 不透明度 | 典型用途 |
| --- | --- | --- |
| `14` | 8% | 大块弱底（退出登录按钮） |
| `1A` | 10% | Tab 选中底 |
| `20` | 12.5% | 图标填充 |
| `26` | 15% | 弹窗次按钮底 |

遮罩只允许三档：`rgba(0,0,0,0.45)`（Modal）、`rgba(0,0,0,0.6)`（图片角标）、`rgba(0,0,0,0.72)`（Toast）。

**语义色缺口（MUST 补齐为 token）**

| 语义 | 当前值 | 出现位置 | 建议 token |
| --- | --- | --- | --- |
| ✅ 错误 / 表单校验 | `#ef4444` → `theme.danger` | 已落地（2026-10-17） | `danger` |
| 点赞 / 喜爱 | `#FF6B6B` | `CommentItem.tsx:390`、`CommentDetailMainComment.tsx:226` | `like` |
| 官方 / 楼主标识 | `#12ADB3` | 4 个 comment 组件 | `official` |
| 破坏性操作 | `#FF3B30` | `FloatingActionMenu.tsx:120` | `dangerFill` |
| 次级灰字 | `#999999` | `settings/index.tsx:49`、`settings/push.tsx:80` | 用 `mutedForeground` |
| 箭头 / 装饰灰 | `#C7C7CC` | `settings/index.tsx:53` | `iconMuted` |
| 未选中 Tab | ~~`#666`~~ | 已改为 `mutedForeground`（2026-10-17） | ✅ 已修复 |
| ~~iOS 系统蓝~~ | ~~`#007AFF`~~ | 唯一出处 `MessageActionSheet.tsx` 已删除（零引用死代码） | ✅ 已消除 |

### 2.2 字体与字号

**字体族：仅系统字体**（`fontFamily: "System"`）。**MUST NOT** 引入自定义字体，除非同时给出中文/英文双字重方案。

**语义字号（`ThemedText` variant）**

| Variant | 字号 / 字重 | 用途 |
| --- | --- | --- |
| `h1` | 24 / 700 | 页面主标题（极少用） |
| `h2` | 20 / 600 | 区块标题 |
| `h3` | 18 / 600 | 卡片标题、文章标题 |
| `body` | 16 / 400 | 正文、列表主文字 |
| `bodySmall` | 14 / 400 | 次要正文 |
| `caption` | 12 / 400，`secondary` | 时间、计数、辅助说明 |
| `label` | 12 / 500 | 标签 |

**实际使用阶梯（代码统计）**

`32 / 28 / 26 / 24 / 22 / 20 / 18 / 16 / 15 / 14 / 13 / 12 / 11 / 10`

其中 **15 号字使用最多**（设置行、按钮、聊天、输入框），但语义层没有对应 variant，导致大量 `size={15}` 覆盖。这是当前最大的排版债。

**约束**

- 新代码 **MUST** 从 `11 / 12 / 13 / 14 / 15 / 16 / 18 / 20 / 22 / 24 / 32` 中取值，**MUST NOT** 出现 9、10、17、19、21、23、25 等中间值。
- 行高：正文 = 字号 × 1.4（16→22，14→20，13→18）；标题 16→22；caption 12→18。
- 中文正文 **SHOULD NOT** 小于 12；辅助信息最小 11。
- 字重只用 `400 / 500 / 600 / 700 / 800`；`900` 仅用于数字强调。
- 中文 **MUST NOT** 使用 `letterSpacing`。

### 2.3 间距

**基础网格 4pt**，允许值：`4 / 6 / 8 / 10 / 12 / 14 / 16 / 20 / 24 / 28 / 36`。

| 场景 | 值 | 备注 |
| --- | --- | --- |
| 页面左右 gutter | **16** | 主导值（50 处） |
| 信息流卡片内边距 | **14** | `ArticleCard` 固定 14 |
| 评论条目内边距 | **14** | 与信息流一致 |
| 聊天列表 | 12 | 密度更高 |
| 设置行高 | min 48，垂直 14 | iOS 规范 |
| 主按钮高 | 52 | 登录、退出 |
| 输入框高 | 54 | `FloatInput` |
| 顶部 Tab 高 | 40–48 | 圈子 40，首页 44 |
| 区块间距 | 8 / 12 / 20 / 24 | 设置分组 8 |

**已知冲突（需统一）**

信息流用 14，Banner 与搜索框用 16，导致同一屏内文字左边缘与 Banner 左边缘差 2px（`Feed.tsx:158` vs `ArticleCard.tsx:520`）。评论列表容器 16、条目内部 14，同样错位（`ArticleCommentList.tsx:352` vs `CommentItem.tsx:431`）。

> 建议：**页面级 gutter 统一 16**，信息流卡片改为「外层 16 + 内层 0」，用 `paddingHorizontal: 16` 的容器包裹，视觉密度不变但基线对齐。

### 2.4 圆角

| 值 | 语义 | 示例 |
| --- | --- | --- |
| 2 | 细指示条 | Tab 指示器 20×4 |
| 8 | 媒体容器 | 封面图、Banner、图片网格、Toast |
| 12 | 可交互面 | 卡片、输入框、主按钮、头像（方形） |
| 14 | 对话框 | Confirm 卡片 |
| 18 | 气泡 | 聊天气泡、日期分隔胶囊 |
| 20 | 底部面板顶角 | 个人主页内容面、圈子内容面 |
| 22 / 26 | 大胶囊 | 编辑资料按钮（22）、退出按钮（26） |
| 999 | 全圆 | 头像、开关轨道、未读点、角标 |

**约束**

- **MUST** 使用上表值，禁止 7 / 9 / 13 / 17 等非标值。
- `borderRadius: 99` 与 `999` 并存，**MUST** 统一为 `999`。
- 图片容器圆角与父容器一致，避免「圆角里套方角」。

### 2.5 描边与层级

- 分隔线：`StyleSheet.hairlineWidth`，颜色 `theme.border`。
- 输入框：`borderWidth: 1.5`，聚焦 `primary`，错误 `danger`。
- 选中卡片 / 头像描边：`1`。
- 阴影：仅 `Switch` 滑块（`opacity 0.2 / elevation 2`）。其余 **MUST NOT** 使用。
- 层级顺序：画布 `background` → 内容面 `card` → 浮层（Sheet / Modal）→ Toast。

**暗色层级（已修复 2026-10-17）**

- `border` 已由 `#0c0f1d` 改为 `#262a3b`：hairline 在卡片上重新可见，不再读成「缝隙」。
- `secondaryBackground` 已由 `#4a5565` 改为 `#151827`：亮度顺序恢复为 `background #0c0f1d (L .0051) < secondaryBackground #151827 (L .0096) < card #1b1d2a (L .0128)`，卡片重新「浮起」。
- 约束：暗色新增任何面时，**MUST** 保持 `画布 < 次级面 < 卡片 < 浮层` 的亮度递增关系。

### 2.6 图标

- 主图标库：**lucide-react-native**（41 个文件）。`Ionicons` 仅搜索框一处，`MessageIcons` 为自绘 SVG。
- 新代码 **MUST** 使用 lucide；**MUST NOT** 混用第三套图标库。
- 尺寸阶梯：`12 / 14 / 16 / 18 / 20 / 24`（辅助 11、13 允许用于角标内）。
- 默认 `strokeWidth = 2`；仅 `#` 话题符号用 `3` 增强识别。
- 图标颜色 **MUST** 通过 `ThemedIcon` 的 `variant` 或主题色取值，**MUST NOT** 写字面量 `#666` / `#999`。
- 纯图标按钮 **MUST** 提供 `accessibilityLabel` 与 `hitSlop ≥ 8`。

### 2.7 动效

| 场景 | 时长 / 曲线 |
| --- | --- |
| 输入框 label 浮起 | 150ms timing |
| Toast 进出 | 180ms / 160ms |
| 面板切换 | 180ms 出 + 220ms 入 |
| 开关 | 200ms timing |
| Hero 高度回弹 | 250ms timing |
| 热搜跑马灯 | 380ms |
| Tab 指示器 | spring, tension 300 / friction 30 |
| Tab 文字缩放 | 选中 1.125，跟随手势插值 |

**约束**

- 微交互 **MUST** 落在 150–250ms；**MUST NOT** 超过 400ms（跑马灯除外）。
- 能用 `useNativeDriver: true` 的 **MUST** 开启；颜色/高度插值除外。
- 手势驱动的过渡（Tab 指示器、Hero 折叠）**MUST** 与手势位置线性绑定，不额外加 easing。
- 点赞、关注、发送消息、切换 Tab **SHOULD** 加 `expo-haptics`（`impactAsync` light）。当前依赖已安装但**全站未使用**，是低成本质感提升点。

---

## 3. 页面骨架模式

### 3.1 首页 Feed（`app/(tabs)/index.tsx`）

```
SafeArea(card 底)
├─ 顶部 TabBar：3 项，16/600，选中主色 + 20×4 指示器，选中缩放 1.125
├─ SearchBar：36 高 / 圆角 17 / secondaryBackground 底 / 热搜跑马灯
└─ TabView（可横滑）
   └─ FlatList：卡片间 hairline 分隔，末项去线
      ├─ Header：头像 40 + 昵称 16/500 + 时间·分类 10/caption
      ├─ 标题：16/500，行高 22，最多 3 行
      ├─ 媒体：单图 80% 宽（最大高 280）｜双图 160 高｜三图 140 高，间隙 2
      └─ Footer：浏览 / 评论 / 点赞，图标 18 + 数字 12
```

**约束**：信息流卡片 **MUST NOT** 加外边框、阴影、卡片间距（用 hairline 分隔）；封面比例固定 16:9。

### 3.2 圈子 / 话题（`app/(tabs)/circle/_layout.tsx`、`app/topic/[id].tsx`）

Hero 208 高，封面取色 → 压暗 24% 作为底色；内容面顶角 20；子分类 Tab 40 高，指示器同首页；滚动折叠时 Hero 位移 + 内容淡出。

### 3.3 个人主页（`app/(tabs)/profile.tsx`）

```
Hero 208（封面 + 顶部黑色渐变遮罩 0.48→0）
├─ 头像 80，left 24，top 168（与内容面顶角重叠 40）
└─ 内容面：card 底，顶角 20
   ├─ 右上「编辑资料」描边胶囊按钮：32 高 / 圆角 22 / 主色描边
   ├─ 昵称 18/800 + 护照 ID 12 + 简介 12
   ├─ 数据行：4 项，值 700 + 标签 caption，垂直 20
   └─ Sticky Tab 40：5 项，指示器 20×4
```

**约束**：Hero 高度、内容面圆角、头像尺寸三者联动，新页面 **MUST** 复用同一组常量（208 / 20 / 80），不得另设数值。

### 3.4 文章详情（`app/article/[id].tsx`）

gutter 16；标题 18/500；正文为 WebView 渲染，宽度 = 屏宽 − 32；元信息行 12 + 图标 14；底部固定操作栏。

### 3.5 设置（`app/settings/index.tsx`）

iOS 分组列表：section 间距 8，行 min 48 / 水平 16 / 垂直 14，右侧值 15 + 箭头 20；分组之间无标题；退出登录为主色 8% 底 + 主色字，52 高 / 圆角 26。

### 3.6 登录（`app/auth/index.tsx`）

品牌字标 32/800 居中；面板标题 22/700；输入框 `FloatInput` 54 高 / 圆角 12 / 1.5 描边 / label 15→11；主按钮 52 高 / 圆角 12 / 15/600；协议复选框 16 / 圆角 4。

### 3.7 聊天（`app/chat/[id].tsx`）

气泡圆角 18、内边距 14/10、最大宽 75%；自己 = `primary` 底 + 白字，对方 = `card` 底 + 主文字；头像 36 圆；日期分隔 = hairline + 12/caption 胶囊。

---

## 4. 组件约束

### 4.1 目录职责

组件按「**原子 → 能力 → 业务**」三层归类。新增组件时先问一句：它属于哪一层？

| 目录 | 职责 | 判定标准 |
| --- | --- | --- |
| `components/ui/` | 全局原子组件（11 个） | 与业务无关，任何页面都可能用；不含路由/接口依赖 |
| `components/media/` | 媒体交互能力 | 图片查看、缩放、裁剪（`GestureImageViewer` / `ChatImageViewer` / `ImageCropperSheet`） |
| `components/rich-text/` | 富文本渲染 | HTML / Markdown 解析与样式注入（`RenderHtml` / `Markdown`） |
| `components/feedback/` | 浮层与轻交互 | 菜单、ActionSheet、轻提示 |
| `components/article/` | 文章域 | 卡片、详情、播放器、分享 |
| `components/comment/` | 评论域 | 列表、条目、输入器（含 `CommentComposerModal/` 子目录） |
| `components/message/` | 私信 / 通知域 | 会话行、分类列表、消息图标 |
| `components/profile/` | 个人主页域 | 主页 Tab、历史、关注卡片 |
| `components/home/` | 首页信息流域 | Feed、Banner、关注流 |
| `components/topic/` `components/search/` `components/user/` | 各自领域 | 话题条目、筛选浮层、用户卡片 |

**归类的三条硬规则**

1. **MUST NOT** 把带业务语义的组件放进 `ui/`。`ArticleCard`、`CommentItem` 永远留在业务目录。
2. **MUST** 让 `ui/` 内的组件不反向依赖业务目录。`ui/` 只能依赖 `hooks/`、`constants/`、`lib/`。
3. 同一份样式出现第二次时，**MUST** 抽成变体组件放进 `ui/`，而不是复制 `styles.xxx`。

> 已清理：`MessageActionSheet.tsx`、`FlexSpacer.tsx` 零引用，已删除（2026-10-17）。`ui/` 的组件从 17 个收敛到 11 个，另有 `index.ts` 统一导出。

### 4.2 基础组件约束

| 组件 | MUST | MUST NOT |
| --- | --- | --- |
| `ThemedText` | 所有文字都用它；颜色走 `theme.*` 或语义 `variant` | 直接用 `<Text>` 并写死颜色（聊天/协议页历史遗留除外） |
| `ThemedIcon` | 统一 `variant` 取色 | 手写 `color="#999"` |
| `Button` | 所有可点文字按钮 | 再写一份 `styles.primaryBtn` / `saveBtn` |
| `Badge` | 角标、未读数、状态标签 | 手写 `minWidth/height/borderRadius` 三件套 |
| `Chip` | 筛选条件、搜索历史、热门词 | 用 `Pressable` + 内联 `paddingVertical` 拼胶囊 |
| `Avatar` | `size` 用 24/30/36/40/80 | 自行计算圆角（`rounded` 已处理） |
| `AsyncImage` | 列表图片必须给 `recyclingKey` 或稳定 `source` | 用原生 `Image` 加载远程图（无缓存策略） |
| `Switch` | 44×24 轨道、16 滑块 | 用系统 `Switch`（视觉不一致） |
| `FloatInput` | 表单输入统一使用 | 自建输入框（label 行为会不一致） |
| `Loading` | 首屏用骨架屏；分页用 `ListFooterLoadingComponent` | 全屏转圈超过 1 次/页 |
| Toast | 居中、2s、单行短句 | 用 Toast 承载需要用户决策的信息 |
| Confirm | 破坏性操作必须二次确认 | 用系统 `Alert`（主题不跟随） |

### 4.3 变体矩阵

**Button**（`components/ui/Button.tsx`）

| variant | 底色 | 文字 | 使用场景 |
| --- | --- | --- | --- |
| `primary` | `primaryFill` | `#fff` | 页面唯一主操作：登录、注册、保存、提交 |
| `secondary` | `muted` | `foreground` | 次级操作：取消、跳过 |
| `outline` | 透明 + 描边 | 随 `tone` | 与主操作并列的替代路径：已关注、发送验证码 |
| `ghost` | 透明 | `primaryText` | 文字链式操作：返回、查看更多 |
| `danger` | `dangerFill` | `#fff` | 不可逆操作：删除、拉黑 |

| size | 高度 | 水平内边距 | 字号 | 图标 | 圆角（`rounded`） |
| --- | --- | --- | --- | --- | --- |
| `sm` | 32 | 14 | 13 | 14 | 10 |
| `md` | 44 | 20 | 14 | 16 | 12 |
| `lg` | 52 | 24 | 15 | 18 | 12 |

`shape`：`rounded`（表单按钮）｜`pill`（行内胶囊，圆角 999）。

`tone`：仅对非实心变体生效 —— `primary`（主色文字/描边）、`neutral`（默认，中性灰）、`danger`。`ghost` 默认 `primary`，其余默认 `neutral`。

**状态**：`disabled` 时实心按钮换成 `muted` 底 + `secondary` 文字（保持可读）；非实心按钮用 45% 透明度。`loading` 时禁用交互并保留原高度，**MUST NOT** 让按钮塌陷。

**Badge**（`components/ui/Badge.tsx`）

| variant | 形态 | 场景 |
| --- | --- | --- |
| `count` | 最小 18×18 胶囊，`>99` 显示 `99+` | 未读消息数、通知数 |
| `dot` | 8×8 圆点 | 有更新但不暴露数量 |
| `label` | 高 18/22 胶囊，可带描边 | 话题标签、状态标签 |

`tone`：`primary`（`primaryFill` + 白字）｜`neutral`（`muted` 底）｜`danger`（`dangerFill` + 白字）。`size`：`sm` / `md`。

**Chip**（`components/ui/Chip.tsx`）

| variant | 默认 | `selected` 后 |
| --- | --- | --- |
| `soft` | `muted` 底 + `foreground` 字 | `primary` 10% 底 + `primaryText` 字 |
| `outline` | 透明 + `border` 描边 | 透明 + `primaryText` 描边与文字 |
| `solid` | `primaryFill` 底 + 白字 | 忽略（本身已是强调态） |

`size`：`sm`（26）/ `md`（32），恒为胶囊。传 `onClose` 时尾部渲染关闭按钮。

### 4.4 文本与图标变体

`ThemedText` 的 `variant` 分三类角色，**MUST NOT** 混用：

| 角色 | variant | 说明 |
| --- | --- | --- |
| 文字色 | `default` / `muted` / `secondary` / `primary` / `danger` | `muted` 已修正为 `mutedForeground`（原为表面色 `#f1f4f9`，作文字几乎不可见） |
| 反白色 | `onPrimary` / `inverse` | 只用于深色填充之上 |
| 字号阶梯 | `h1`(24) / `h2`(20) / `h3`(18) / `body`(16) / `bodyMedium`(15) / `bodySmall`(14) / `caption`(12) / `label`(12) | `bodyMedium`(15) 是项目内最高频字号，新增 |

`ThemedIcon` 的 `variant`：`default` / `muted` / `secondary` / `inverse` / `primary` / `onPrimary` / `danger`。其中 `muted` 已修正为 `mutedForeground`（原与 `secondary` 同值，语义重复）。

---

## 5. 状态与反馈

| 状态 | 规范 |
| --- | --- |
| 首屏加载 | 骨架屏，`theme.muted` 块，圆角随内容（18→9，14→7） |
| 分页加载 | 列表底部 `ActivityIndicator` small，上下 16 |
| 加载完 | 13 号 `secondary` 文案「已经到底了」 |
| 空状态 | 居中，`paddingTop 48`，14 号 `secondary` |
| 错误 | Toast（居中）或字段级红字 12；**MUST NOT** 用弹窗报错 |
| 破坏性操作 | Confirm 弹窗，主按钮主色，次按钮主色 15% 底 |
| 触觉 | 点赞 / 关注 / 发送 / 切 Tab 建议 light impact |

---

## 6. 暗色模式规则

- 切换入口：`settingsStore.appearance` = `auto | light | dark`，默认 `auto`。
- **MUST** 所有颜色取自 `useTheme().theme`，**MUST NOT** 写死浅色值。
- 状态栏：普通页 `dark/light` 跟随；Hero 页强制 `light`，离开时恢复。
- 图片上的文字 **MUST** 加深色渐变遮罩（0.48 → 0.24 → 0），保证白字可读。
- 主色填充统一 `primaryFill #4C63E6`；主色文字亮色 `#4C63E6` / 暗色 `#8FA2FF`。`#6680ff` 仅用于非文字元素。

**已修复（2026-10-17）**

1. ✅ `border` 与 `background` 同值 → 改为 `#262a3b`。
2. ✅ `secondaryBackground` 比 `card` 亮 → 改为 `#151827`。
3. ✅ Tab 未选中图标 `fill` 用 43% 黑 → 改为 `transparent`。
4. ✅ 首页 / 搜索未选中 Tab 写死 `#666` → 改为 `theme.mutedForeground`。

---

## 7. 国际化与文案

- 语言：`zh` / `en`，全部文案走 `i18next`。已核查：**无硬编码中文**（`PicArt` 品牌字标为唯一例外）。
- 文案风格：短句、动宾结构、无句号；按钮 2–4 字；标题最多 3 行。
- 数字：`formatCount` 使用「1.2w」中文习惯，英文环境应输出「12k」。**SHOULD** 抽为 `formatCount(value, locale)`。
- 英文文案长度按中文 ×1.3 预留；**MUST NOT** 给文字容器设固定宽度，用 `flex + numberOfLines`。
- 时间：相对时间（刚刚 / 5 分钟前 / 昨天），聊天用绝对时间 + 日期分隔。

---

## 8. 可访问性

**对比度实测**

| 前景 / 背景 | 比值 | 结论 |
| --- | --- | --- |
| `#ffffff` / `primaryFill #4C63E6` | **4.96:1** | ✅ 正文合格（已全站替换） |
| `primaryText #4C63E6` / `#ffffff` | **4.96:1** | ✅ 亮色链接合格 |
| `primaryText #4C63E6` / `#f8f9fd` | 4.71:1 | ✅ 亮色画布上合格 |
| `primaryText #8FA2FF` / `#1b1d2a` | **6.99:1** | ✅ 暗色链接合格 |
| `primaryText #8FA2FF` / `#0c0f1d` | 7.97:1 | ✅ 暗色画布上合格 |
| `#ffffff` / `#6680ff`（旧主色） | 3.44:1 | ⚠️ 仅限非文字元素（≥3:1） |
| `#00000073` 合成 `#888` / `#f8f9fd` | **3.4:1** | ❌ 12 号 caption 仍不合格 |
| `#6b7280` / `#f8f9fd` | 4.56:1 | ✅ 次级文字推荐值 |
| `#999999` / `#ffffff` | 2.85:1 | ❌ 仅装饰可用（设置页待替换） |
| `#ededed` / `#0c0f1d` | 15.4:1 | ✅ |

**修正建议**

- ✅ 已实施：`primaryFill #4C63E6`（白字 4.96:1）用于承载白字的按钮/气泡/角标；`primaryText`（亮 `#4C63E6` / 暗 `#8FA2FF`）用于文字与链接；`#6680ff` 保留给指示器、图标、光标。
- 次级文字统一 `mutedForeground #6b7280`，停用 `#00000073` 作为 12 号正文。
- 触控目标 ≥ 44×44（图标按钮用 `hitSlop` 补齐）。
- 纯图标按钮补 `accessibilityLabel`；图片补 `accessibilityLabel` 或标记装饰性。
- 支持系统字号放大：**MUST NOT** 用固定高度裁切文字（设置行已用 `minHeight`，正确）。

---

## 9. 现存偏差清单

| 级别 | 位置 | 问题 | 状态 / 建议 |
| --- | --- | --- | --- |
| ✅ P0 | `constants/theme.ts:86` | 暗色 `border` = `background` | 已改为 `#262a3b` |
| ✅ P0 | `constants/theme.ts:109` | 暗色 `secondaryBackground` 亮于 `card` | 已改为 `#151827` |
| ✅ P0 | `constants/theme.ts:36` | 主色白字 3.44:1 | 已新增 `primaryFill` / `primaryText` 并替换全站 |
| ✅ P1 | `components/ui/ThemedText.tsx` | `muted` 变体用了表面色 | 已映射 `mutedForeground` |
| P1 | `app/settings/index.tsx:49,53` | `#999999` / `#C7C7CC` 硬编码 | 用 `mutedForeground` / `iconMuted` |
| ✅ P1 | `app/(tabs)/index.tsx`、`app/search/index.tsx` | `#666` 未选中 Tab | 已改为 `theme.mutedForeground` |
| ✅ P1 | ~~`components/ui/MessageActionSheet.tsx`~~ | `#007AFF` 与品牌蓝冲突 | 文件零引用，已删除 |
| P1 | 4 个 comment 组件 | `#12ADB3` 重复定义 4 次 | 提为 `official` token |
| ✅ P1 | `FloatInput.tsx`、`edit-profile/index.tsx` | `#ef4444` 重复定义 5 次 | 已新增 `danger` token 并替换 |
| ✅ P1 | 5 个页面 | `primaryBtn` / `saveBtn` / `submitBtn` / `followBtn` / `retryBtn` / `loginBtn` 各写一遍 | 已收敛为 `Button` 变体（7 处） |
| ✅ P1 | `app/(tabs)/messages/index.tsx` | 未读角标尺寸重复 3 份 | 已收敛为 `Badge` |
| ✅ P1 | `app/search/index.tsx` | `historyChip` / `hotChip` 各写一遍 | 已收敛为 `Chip` |
| P1 | `components/home/Follow.tsx:219` | `loginBtn` 与主按钮体系脱节 | 待迁移到 `Button variant="secondary" shape="pill"` |
| P1 | `app/topic/[id].tsx:777` | Hero 上的关注按钮需反白，无法用现有变体 | 待新增 `onDark` tone 后迁移 |
| P2 | `ArticleCard.tsx:520` vs `Feed.tsx:158` | 14 / 16 gutter 混用 | 统一 16 |
| P2 | `CommentItem.tsx:431` vs `ArticleCommentList.tsx:352` | 同上 | 统一 16 |
| P2 | `components/ui/Avatar.tsx:32,66` | 静态 `borderWidth: 2` 被动态值覆盖，死代码 | 删除静态值 |
| P2 | `ArticleHistoryCard.tsx:103`、`ArticleSearchCard.tsx:192`、`ReactionsStats.tsx:233`、`CommentDetailMainComment.tsx:320`、`CommentItem.tsx:514` | `borderRadius: 99` 与全站 `999` 并存 | 统一 999 |
| ✅ P2 | `app/(tabs)/_layout.tsx:78` | 未选中图标 `fill` 用 43% 黑 | 已改 `transparent` |
| P2 | `app.json:43-49` | 启动屏 `#ffffff/#000000` 与应用底色不一致；图标为 Expo 模板资源 | 换品牌图标 + 底色 `#f8f9fd/#0c0f1d` |
| P2 | 全站 | `expo-haptics` 已安装未使用 | 关键操作补触觉 |

---

## 10. 落地路线

**Step 1 · 令牌层（✅ 已完成 2026-10-17）**
已在 `constants/theme.ts` 新增 `primaryFill / primaryText`，修正暗色 `border #262a3b` 与 `secondaryBackground #151827`，并完成全站 60+ 处调用替换（TypeScript 与 ESLint 通过）。

**Step 2 · 语义色与变体组件（✅ 已完成 2026-10-17）**
新增 `dangerFill / danger` 并替换 5 处 `#ef4444`；修正 `ThemedText.muted` → `mutedForeground`、`ThemedIcon.muted` 语义；补齐 `ThemedText.bodyMedium`(15)、`primary`、`onPrimary`、`danger` 变体；新建 `Button` / `Badge` / `Chip` 三个变体组件；按功能重组组件目录（新增 `media/` `rich-text/` `feedback/`，删除 2 个零引用文件）。

**Step 3 · 页面收口（进行中）**
已替换 7 处按钮、3 处角标、2 处胶囊。剩余：`#999999` / `#C7C7CC` / `#12ADB3` / `#FF6B6B` 换 token；`Follow.tsx` 登录按钮与 `topic` Hero 关注按钮迁移到 `Button`；统一 gutter 16。

**Step 4 · 验收**
用附录 B 清单逐页自查；补一轮暗色截图对比；跑一次对比度检查。

---

## 附录 A · Do / Don't 速查

| ✅ Do | ❌ Don't |
| --- | --- |
| 白色卡片 + `#f8f9fd` 画布 | 给卡片加阴影或描边来「突出」 |
| hairline 分隔列表 | 用 8px 间隙堆卡片（信息流） |
| 主色只用于选中/可点/进度 | 用主色做大面积背景（除气泡/按钮） |
| 文字用 `primaryText`，白字底用 `primaryFill` | 用 `#6680ff` 承载白字或作为小字链接 |
| 圆角 8 / 12 / 20 / 999 | 圆角 5、7、9、13 等随手值 |
| 字号 12/14/15/16 为主 | 新增 17、19、21 |
| 图标 18 + `hitSlop 10` | 12 号图标无热区 |
| 暗色走 `theme.*` | 写死 `#fff` / `#000` 作为文字色 |
| 文案走 i18n | 在 JSX 里写中文 |
| 破坏性操作二次确认 | 直接执行删除/退出 |
| 按钮用 `<Button variant size shape>` | 在页面里写 `styles.primaryBtn` |
| 角标用 `<Badge variant="count">` | 手写 `minWidth/height/borderRadius` |
| 筛选条件用 `<Chip selected>` | 用 `Pressable` 拼胶囊 |
| 一个屏幕至多 1 个 `primary` 按钮 | 三四个主色按钮互相抢焦点 |

## 附录 B · 新页面自查清单

- [ ] 所有颜色来自 `useTheme().theme`，无字面量
- [ ] 字号来自允许阶梯，行高 ≥ 字号 × 1.4
- [ ] 水平 gutter = 16，垂直节奏为 4 的倍数
- [ ] 圆角取自 {8, 12, 14, 18, 20, 22, 26, 999}
- [ ] 无卡片阴影；分隔线用 `hairlineWidth`
- [ ] 亮/暗两套截图均通过
- [ ] 主色文字/按钮使用 `primaryText` / `primaryFill`，不直接用 `primary` 承载文字
- [ ] 所有按钮来自 `Button`，未新增 `styles.xxxBtn`
- [ ] 角标 / 胶囊来自 `Badge` / `Chip`
- [ ] 一个屏幕内 `primary` 按钮 ≤ 1 个
- [ ] 空态、加载、错误三态齐备
- [ ] 图标按钮有 `accessibilityLabel` + `hitSlop`
- [ ] 文案全部走 `t()`，英文长度不截断
- [ ] 图片有占位与 `recyclingKey`
- [ ] 交互时长 150–250ms，能用原生驱动

---

## 变更记录

| 日期 | 版本 | 变更 |
| --- | --- | --- |
| 2026-10-17 | v1.0 | 首次审阅，建立令牌、页面骨架、组件约束与偏差清单 |
| 2026-10-17 | v1.1 | 落地 P0：新增 `primaryFill` / `primaryText`；暗色 `border` → `#262a3b`、`secondaryBackground` → `#151827`；替换全站 60+ 处主色文字/填充；修复 `#666` 未选中 Tab、暗色 Tab 图标填充 |
| 2026-10-17 | v1.2 | 新增 `dangerFill` / `danger` 令牌；新建 `Button` / `Badge` / `Chip` 变体组件；补齐 `ThemedText`（`bodyMedium` / `primary` / `onPrimary` / `danger`）与 `ThemedIcon`（`primary` / `onPrimary` / `danger`）变体，修正 `muted` 语义；按功能重组组件目录（新增 `media/` `rich-text/` `feedback/`，`ui/` 组件从 17 → 11 个，删除 2 个零引用文件）；收敛 7 处按钮、3 处角标、2 处胶囊 |

*本文档基于当前代码静态审阅得出，数值均来自源码实测；若 `constants/theme.ts` 变更，请同步更新第 2 章。*
