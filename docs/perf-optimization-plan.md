# CeryLab (picart_native_app) 性能优化方案

> 结论先行：这个项目**不缺人为的 memo / useCallback**（React Compiler 已开），
> 真正的性能损失集中在「**每个列表项都在做不该由列表项做的事**」——
> 三份自动翻译、一整台图片查看器、两份图片实例、large 级缩略图。
> 6 个列表页共用 `ArticleCard`，改一处收益铺满全站。

---

## 一、现状体检

| 指标 | 现状 |
| --- | --- |
| 业务代码规模 | 45,734 行（app + components + hooks + lib + store） |
| 含列表/滚动容器的文件 | 43 个 |
| `ArticleCard` 使用点 | 6 处列表（home / follow / circle / topic / profile-posts / profile-favorites） |
| 首屏卡片数（首页） | 20 张 |
| 首屏 JS 侧翻译任务 | **20 × 3 = 60 次**（title / category / summary） |
| 首屏 Animated.Value | **20 × 3 = 60 个**（每个 useTranslate 一个 fadeAnim） |
| 首屏图片查看器实例 | **20 个**（每张卡都挂一份 `GestureImageViewer`，1183 行） |
| 首屏 ShareModal 实例 | **20 个**（未做懒挂载） |
| 卡片封面图规格 | 全部走 `getImageUrl(image, "large")` |
| 自动翻译开关 | `autoTranslate` 默认 `true` |

### 关键链路耗时拆解（首屏，估算量级）

```
启动
 ├─ configurePushNotifications()  模块级副作用（lib/push.ts，482 行）
 ├─ primeEmojiCache()            额外一次网络
 └─ prefetch(home / categories / circle)   3 个并发请求
首页 Feed 渲染 20 张卡
 ├─ 60 次 translateText  → 至少 2–3 批 POST 到 edge.microsoft.com
 │    （每批还要跑 hasTranslatableContent + franc 语言统计，主线程同步 CPU）
 ├─ 20 × GestureImageViewer      → 20 份 useSafeAreaInsets/useWindowDimensions/
 │    useGlobalSearchParams/useAuthStore×2/useConfirm + 10+ useState
 ├─ 20 × ShareModal              → 20 份 ReportProvider 子树
 ├─ 40–60 × expo-image 原生视图  → AsyncImage 单图挂载两次（overlay → base 交接）
 └─ large 缩略图                 → 单图带宽/解码内存 ≈ medium 的 3–4 倍
```

---

## 二、P0 — 立刻做，收益最大、风险最低（预计 1–2 天）

### P0-1　把「列表卡片自动翻译」从每卡三次降到每屏一次

**位置**：`components/article/ArticleCard.tsx:89-105`、`hooks/useTranslate.ts:150-158`、`lib/translate.ts:271`

**问题**：
1. 每张卡调用 3 次 `useTranslate(..., { auto: true })`，各自开一个 `Animated.Value`、各自跑 effect 触发 `translate()`。
2. `translateText()` **没有 `isAlreadyTargetLang` 短路**（该函数只用在 `translateHtml` 里，见 `lib/translate.ts:481`）。
   也就是说：中文用户看中文文章，60 条文本照样全部打到微软端点——纯浪费。
3. `getDetectedLang(source)` 在 `useTranslate.ts:55` **渲染期同步调用**，内部会跑 `franc()` 语言统计（`franc-min` 带完整语料表），是主线程 CPU 大头。
4. 三个译文缓存 `cache` / `detectedLangCache` 都是无上限 `Map`，长会话下只增不减（内存）。

**改法**：
- `translateText` 入口补 `isAlreadyTargetLang(detectLangLocally(text), text, to)` 短路，命中直接返回原文并写缓存（`hasTranslatableContent` 已有，位置相邻）。
- 卡片里 `summary` 的翻译直接去掉——`ArticleCard.tsx:437` 那段已经整块注释掉了，但 **hook 还在跑**。删 hook，不是删 JSX。
- `category.name` 不翻译：它是后端字典项，本身就随语言下发；如必须翻译，走 `categoryStore` 按 id 缓存，别每卡算。
- 标题翻译改为**屏幕级批量**：`Feed` 拿到 `newData` 后用 `translateBatch(titles, to)` 一次算完，结果塞进一个 `Record<articleId, string>` 状态，卡片只读。首屏 60 次任务 → 1–2 次合并请求。
- `detectedLangCache` / `cache` 加 LRU 上限（500–1000 条，和 `AsyncImage.tsx:23` 的 `MAX_CACHED_IMAGE_KEYS` 同样手法）。

**收益**：首屏网络请求 −50 以上；主线程 franc 调用从 60 次降到 ≤20 次（且只在真需要翻译时）。
**风险**：中。`useTranslate` 被 12 处使用，改 `translateText` 短路是全局行为变更，需回归「翻译标语是否还正常出现」（`app/article/[id].tsx` 的标语判定依赖 `译文 !== 原文`，现有逻辑已兼容）。

---

### P0-2　图片查看器与分享面板从「每卡一份」提成「列表级单例」

**位置**：`ArticleCard.tsx:206-345`（`renderMedia` 里包 `GestureImageViewer`）、`ArticleCard.tsx:507`（无条件渲染 `ShareModal`）

**问题**：
`GestureImageViewer` 是一个 1183 行的组件，内部持有 `useSafeAreaInsets`、`useWindowDimensions`、
`useGlobalSearchParams`、`usePathname`、`useRouter`、`useAuthStore ×2`、`useConfirm`、`useTranslation`、
**10 个 useState**，以及 `ShareModal` + `CommentComposerModal` + `BottomSheetModalProvider` 三套子树。
它被**每张卡片各挂一份**——20 张卡 = 20 套。

**改法**（推荐 A）：
- A. 在列表层（`Feed` / `Follow` / `circle` / `topic` / `PostsTab` / `FavoritesTab`）挂**一个** `ImageViewerHost`，
  卡片只调用 `useImageViewer().open(images, index)`。把 `GestureImageViewer` 的状态从「每卡」上提到「每列表」。
- B. 折中（改动小）：`GestureImageViewer` 内部把重状态拆到 `<Modal>` 内部子组件，`visible === false` 时不 mount
  （它现在已经是 `visible ? (...) : null`，但 hook 全在外层）。把 hook 移进内层子组件即可，**约 30 行改动**。
- `ArticleCard.tsx:507` 的 `ShareModal` 改为和 `shareRef.present()` 同源的懒挂载（`showShare` 为真才渲染）。
  注意 `ShareModal` 内部包了 `ReportProvider`，别把 Provider 也一起延迟掉而破坏 `useReport` 上下文。

**收益**：首屏 JS 树节点数下降一个数量级（保守估计 −60% 卡片子树），滚动时不再重复创建 gesture handler。
**风险**：中高（A）/ 低（B）。建议先做 B 验证收益，再决定是否做 A。

---

### P0-3　列表缩略图规格下调 + 开启复用

**位置**：`ArticleCard.tsx:243/262/278/300/313/326`、`components/profile/CommentCard.tsx:56`

**问题**：信息流卡片宽度约 350pt，封面格子最小只有 ~110pt，但全部请求 `"large"`。
`lib/image.ts` 已支持 `thumb / medium / large`（`SIZE_KEY_MAP`），后端也已生成三档，白白没用。

**改法**：
- 单图封面 → `"medium"`；2/3 宫格、评论卡配图 → `"small"`。
- 详情页（`ArticleSwiper`、`RenderHtml`）才用 `"large"`，点开大图才用 `"original"`（现状正确）。
- 列表里的 `AsyncImage` 补 `recyclingKey={source}`（目前全项目仅 2 处用到）——`expo-image` 靠它复用原生视图，滚动掉帧最直接的解药。

**收益**：首屏图片流量约 −60~70%，解码内存同步下降；低端机滚动掉帧明显改善。
**风险**：低。视觉上 medium 在 2x/3x 屏依然够清晰；上线前对比截图确认。

---

### P0-4　`AsyncImage` 单图挂载两次 → 收敛成一次

**位置**：`components/ui/AsyncImage.tsx:237-270`

**问题**：
加载期渲 `overlayImage`，`onLoad` 后 `loadedImageSourceKeys.add()` 让 `hasLoadedSource` 变 true，
于是 overlay 卸载、base 重新挂一张**同一 URI** 的 `Image`。等于每张图挂载两次、transition 跑两遍；
列表回收复用时再来一遍。同时 `ImageSkeleton` 自己再订阅一次 `useTheme()`，每张图一个无限循环动画。

**改法**：
- 去掉 base/overlay 双节点，改成单 `Image` + `placeholder` + `transition`；
  骨架屏的显隐用 `opacity` 过渡即可（不需要两个原生视图交接）。
- `ImageSkeleton` 的呼吸动画在列表里直接关掉（列表卡片用静态骨架），只保留详情页动画。
- 只有「曾经加载过、需要立刻无闪烁显示」的场景才需要保留双节点逻辑，用 `recyclingKey + cachePolicy="memory-disk"` 已能覆盖。

**收益**：图片相关原生视图数量减半，`onLoad` 后不再有二次 mount 的帧尖峰。
**风险**：中。这是全站图片基座组件（13 个模块引用），需要真机逐页比对「占位 → 加载」的视觉过渡。

---

## 三、P1 — 结构优化（预计 3–5 天）

### P1-1　列表虚拟化换 FlashList
现状 43 个文件手搓 `FlatList` + `maxToRenderPerBatch/windowSize` 调参（如 `Feed.tsx:157-159`）。
`@shopify/flash-list` v2 在新架构下是官方推荐路线，回收粒度是「视图」而不是「行」，长列表内存和空帧明显更好。
建议**先换 3 个主列表**（home Feed、circle、chat 消息），验证后再铺开。
风险：中。`inverted` 聊天列表、`NestedScrollView`（`@sdcx/nested-scroll`）组合需要单独验证。

### P1-2　启动链路瘦身
- `app/_layout.tsx:33` `configurePushNotifications()` 在**模块加载期**执行，把 `lib/push.ts`（482 行）和
  `expo-notifications` 原生模块初始化压到了首帧之前。挪进 `appReady` 之后的 effect。
- `app/_layout.tsx:61` `primeEmojiCache()` 与首屏渲染抢网络/JS，改为首页首帧后 `InteractionManager` 或空闲回调再跑。
- `app/_layout.tsx:68-83` 现在 `Promise.all([fetchConfig, prefetchHomeFeed, prefetchCategories → prefetchCircleFeed])`
  **全部完成后**才 `hideAsync()`。改成「首屏必需（home feed）就绪即 hide，次要预取后台继续」。
- 目标：冷启动到可交互时间 −300~600ms。

### P1-3　依赖与包体
> 2026-10-22 修正：`@expo/ui` 与 `expo-symbols` 虽然**业务代码零引用**，但 `expo-router` 依赖它们
> （`npm ls` 显示 deduped）。移除直接依赖不会减少包体，反而可能造成版本错位，**不要动**。

| 依赖 | 引用数 | 处置 |
| --- | --- | --- |
| `@expo/ui` | 0（直接） | **保留**：`expo-router` 的传递依赖 |
| `expo-symbols` | 0（直接） | **保留**：`expo-router` 的传递依赖 |
| `react-native-render-html` | 1 | 与 `react-native-enriched-html` / `rich-text-fabric` / `RenderHtml` 并存，四套富文本引擎选一套 |
| `react-native-video` + `expo-video` | 各 1 | 二选一。`ArticleVideoPlayer`（648 行）基于 `react-native-video`，迁移到 `expo-video` 是重写级改动，需单独排期 |
| `expo-sqlite` | 1 | 确认是否只做 kv 用；若是，评估换 `expo-sqlite/kv-store` |
| `franc-min` | 1 | 静态 import 会把语料表带进首屏依赖链，可考虑 `import()` 懒加载（需处理同步调用方降级） |
| `@sdcx/pull-to-refresh` | 3 | 与原生 `RefreshControl` 重复，确认收益后收敛 |

真正能省包体的是「二选一」那几项（视频库、富文本引擎），预计 −8~12MB，
但它们都是代码重写级改动，不能和调整参数混在一起做。

### P1-4　类型与模块边界
- `ArticleCard.tsx:1` 从 **页面** `@/app/article/[id]` 导 `ArticleData`，页面又 import 卡片 → 循环依赖，
  也把页面模块（含 WebView、Swiper、翻译逻辑）拖进了卡片模块的依赖图。抽到 `types/article.ts`。
- 6 处 `<ArticleCard data={item as any} />` 的 `as any` 一起消掉。
- `app/chat/[id].tsx:1418` `keyExtractor` 兜底 `Math.random()` —— key 不稳定会导致列表项每次重挂，
  顺手改成 `item.key` 或 `local-${index}`。

### P1-5　`useTheme` 返回稳定引用
`hooks/useTheme.ts:17` 每次渲染返回**新对象字面量**。目前调用方多是解构所以没炸，
但任何把整个返回对象透传给子组件的场景都会让 memo 失效。改成模块级常量 + `useMemo` 按 `resolvedScheme` 缓存。

---

## 四、P2 — 长期（有节奏地做）

1. **性能基线**：接入 `react-native-performance` 或自建打点，量化「冷启动 / TTI / 首屏 FPS / JS 长任务」，
   每次优化前后各跑一次，避免「凭感觉优化」。
2. **构建**：确认 production 打开 Hermes + JS minify；Fusion Pixel 之类像素字体做子集化（只留实际用到的字形）。
3. **图片管线**：后端已输出 thumb/medium/large，前端按容器尺寸选档；若服务端支持 `?w=` 参数，
   可进一步按 `PixelRatio × 容器宽` 精确取值。
4. **评论树 / Feed 分页**：与 Web 侧第三批优化对齐（keyset 分页、评论 rootId + 递归 CTE），减少列表全量重排。

---

## 五、建议执行顺序与验收

| 阶段 | 内容 | 验收口径 |
| --- | --- | --- |
| 第 1 步 | P0-3 图片规格 + recyclingKey、P0-1 翻译短路 + 去 summary hook | 首屏网络请求数、首屏图片总字节数 |
| 第 2 步 | P0-2（先做 B 方案）、P0-4 | 首屏 JS 树节点数、滚动掉帧率 |
| 第 3 步 | P1-2 启动链路 | 冷启动 → 可交互耗时 |
| 第 4 步 | P1-1 FlashList（3 个主列表试点） | 长列表内存峰值、快速滑动空帧 |
| 第 5 步 | P1-3 依赖瘦身、P1-4/P1-5 代码整洁 | 包体大小、循环依赖为 0 |

**每一步都必须有「改前 / 改后」两组数字**，否则不做下一步。

---

## 六、暂不建议动的部分

- **React Compiler 已经开启**（`app.json: experiments.reactCompiler`），现有大量手写 `memo/useCallback`
  属于冗余但无害，**不要为了清理而清理**——那是几天的纯风险工作量，收益趋近 0。
- **`Animated` vs Reanimated**：项目里 `Animated.Value` 和 `react-native-reanimated 4.3` 并存。
  逐处迁移的收益比不上 P0 各项，先放着；只在做 FlashList/图片查看器改造时顺带把触碰到的部分换成 Reanimated。
- **`console.*` 40 处**：release 构建会被剥离，不构成线上问题，不列为优化项。
