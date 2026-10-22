# 文章编辑器（富文本）审阅与优化方案

> 结论先行：主链路是通的 —— 原生命令 → `prepareArticleHtml` 回填归一化 → 原生编辑 →
> `toArticleHtml` 提交归一化。问题不在"能不能用"，而在三处**会发布出坏内容**的细节：
> ① 行内表情/行内图提交后会被包成块级 wrapper；② 分割线的插入位置用的是**过期选区**；
> ③ 分割线靠"200ms 后摘链"实现，窗口期内发布就会留下 `<a href="#">`。
> 其余是撤销栈状态、能力对齐、性能与可访问性的欠账。

---

## 一、审阅范围

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `components/publish/ArticleRichTextToolbar.tsx` | 1495 | 两层工具栏 + 6 个面板 + 3 个 sheet + 全部插入逻辑 |
| `components/publish/ArticleRichTextInput.tsx` | 121 | 原生输入框封装（`htmlStyle` / 行高 / 主题色） |
| `components/publish/useArticleRichText.ts` | 237 | 选区 / 状态 / 撤销重做（HTML 快照） |
| `lib/editorHtml.ts` | 309 | 回填与提交的双向 HTML 归一化 |
| `constants/editorTextStyles.ts` | 96 | 71 色色板、字号阶梯 |
| `app/publish/index.tsx` | 1409 | 挂载、类型切换、提交 |
| `patches/react-native-enriched-html+1.1.1.patch` | 1875（30 文件） | 原生库 fork |

## 二、链路体检

```
工具按钮 ─┐
         ├─ runCommand(editor) ─→ 原生命令（只改 HTML，不改纯文本）
         │                        └─ onContentChanged → 撤销栈 600ms 防抖快照
输入文字 ─┴─ onChangeText ─→ setBody(纯文本) → 整个发布页 re-render

回填：article.content → prepareArticleHtml(content, 窗口宽-32)
        ├─ ql-size-Npx 类 → <span style="font-size:Npx">
        ├─ ql-align-* 类 → <p style="text-align:...">
        ├─ div.ql-image-wrapper → 裸 <img width height>（尺寸靠 Image.getSize 量）
        └─ 只放图的段落补 text-align:center

提交：getHTML() → toArticleHtml()
        ├─ <p><img></p> → <div class="ql-image-wrapper"><img class="ql-image"></div>
        └─ 裸 <img> → 同上（← 问题所在，见 P0-1）
```

---

## 三、问题清单

### P0 · 会发布出坏内容

**P0-1 行内表情 / 行内图被包成块级 wrapper**

`toArticleHtml` 的两个分支产出同一种结果，没区分"独占一段"和"行内"。实测：

```
入参  <p>你好<img src="…/e.png" width="22" height="22"/>世界</p>
出参  <p>你好<div class="ql-image-wrapper"><img … class="ql-image"></div>世界</p>
```

浏览器会把 `<div>` 从 `<p>` 里挤出来，网页端最终变成
「你好」→ 一张居中大图 → 「世界」被孤立到下一段。表情面板插的每一个 emoji 都受影响。

> 修法：`toArticleHtml` 已经能区分两个捕获组（`inParagraph` / `bare`），只需
> `inParagraph` 走 wrapper，`bare` 保持行内 `<img>` 不包。

**P0-2 分割线插入位置用的是过期选区**

```ts
const insertDivider = useCallback(() => {
  const { start } = savedSelectionRef.current;   // ← 只在开过 sheet / 表情面板时才更新
```

`savedSelectionRef` 仅由 `rememberSelection()` 在 `handleLinkPress` / `handleVideoPress` /
`handleArticlePress` / `openEmojiPanel` 里赋值，初始值是 `{start:0}`。
**直接点「更多 → 分割线」，它会插到文首**。同一场景下 `handleSelectEmoji` 用的是
`selectionRef.current`（实时选区），是对的。

> 修法：面板不抢焦点，直接用 `selectionRef.current`。

**P0-3 分割线靠 200ms 偷链**

`setLink(pos, pos, "──────", "#")` → `setTimeout(200)` → `removeLink`。
窗口期内保存/切类型/离开页面，正文就留下一个 `href="#"` 的死链接；
且这 200ms 的第二次修改不经过 `onContentChanged`，撤销栈只记到"带链接"的中间态。

> 修法：`getHTML()` 后再摘链太绕；建议给原生补一个 `insertDivider` 命令（沿用
> `EnrichedSpanFactory` 加一个 hr span），或退一步：插入后立刻 `getHTML()` 用字符串
> 替换掉 `href="#"` 再 `setValue`（保底方案，不引入原生改动）。

### P1 · 功能正确性 / 体验

| # | 问题 | 位置 | 影响 |
| --- | --- | --- | --- |
| 1 | `canUndo` 乐观置位，与真实历史脱钩 | `useArticleRichText.markUndoAvailable` + `pushHistory` 去重后不 `syncHistoryState` | 连点两次加粗这类"HTML 回到原状"的操作，撤销按钮亮着但点了没反应 |
| 2 | 撤销/重做后光标丢失 | `applyHistory` → `setValue` 只换内容 | 光标跳回开头，继续写要重新定位 |
| 3 | `A⁺/A⁻` 的字号基线是本地 state | `ArticleRichTextToolbar:741` | 原生不回传字号，移动光标到别的字号段后 `A⁺` 从上次设置的值起步 |
| 4 | 能力缺口（对照 web Quill） | — | 见第五节 |
| 5 | 插图不压缩 | `handlePickImage` → `uploadSingleImage(asset.uri)` | 4K 相机图原样上传（几 MB）；`expo-image-manipulator` 已在依赖里，评论/视频帧都在用 |
| 6 | 图片没有 alt | `editor.setImage(url, w, h)` | 读屏软件念不出内容；web 端 SEO 也吃亏 |
| 7 | 失败提示笼统 | `t("article.actionFailed")` | 上传失败 / 权限拒绝 / 链接格式错都用同一句 |

### P2 · 性能与结构

| # | 问题 | 说明 |
| --- | --- | --- |
| 1 | 每敲一个字触发整页 re-render | `onChangeText → setBody` → 发布页 + 1495 行工具栏 + 3 个 sheet 全部重渲染。`body` 只用于"是否非空"和类型切换兜底 |
| 2 | 撤销栈存全量 HTML | 50 条 × 每篇 HTML，长文可达百 KB 级；且每次快照都要过一次原生 `getHTML` 往返 |
| 3 | 工具栏单文件 1495 行 | 一层栏 / 二层栏 / 6 个面板 / 3 个 sheet / 4 个辅助组件挤在一个文件 |
| 4 | 编辑器宽度硬编码 | `getEditorContentWidth = 窗口宽 - 32`，耦合 `app/publish` 的 `PAGE_PADDING=16`；布局一改图片尺寸就偏 |
| 5 | render 期间 setState | `ArticleRichTextToolbar:498` 的 `setPanelReserve` |

### P3 · 可访问性

| # | 问题 | 说明 |
| --- | --- | --- |
| 1 | 触摸目标偏小 | 图标按钮 36+hitSlop4=44 ✓；**色块 22+4=30 ✗**、面板 chip 高 32 ✗ |
| 2 | 色块读屏无意义 | `accessibilityLabel` 是 `rgb(230, 230, 230)`，应给 i18n 色名（"浅灰 3"） |
| 3 | 字号不跟随系统 | `allowFontScaling={false}`（WYSIWYG 合理），但没有替代入口 |
| 4 | 表情/图片无描述 | 见 P1-6 |

---

## 四、优化方案（分三步，每步可独立发版）

### 第 1 步 · 止血（纯 JS，约 0.5 天）

1. `toArticleHtml` 区分行内/块级（P0-1）
2. `insertDivider` 改用 `selectionRef.current`（P0-2）
3. 分割线的时序问题（P0-3，先上保底方案：插入后取 HTML 替换 `href="#"` 再 `setValue`，
   并在同一回调里 `onContentChanged()`）
4. `captureSnapshot` 末尾无条件 `syncHistoryState()`（P1-1）

验收：发布含表情的图文 → 网页端表情在行内、段落不被拆开；正文里点「分割线」落在光标处；
发布后 HTML 里搜不到 `href="#"`。

### 第 2 步 · 补齐（1–2 天）

5. 撤销/重做保留选区：`applyHistory` 记下 `selectionRef.current`，`setValue` 后
   `setSelection` 还原（越界则退到末尾）
6. 插图压缩：`ImageManipulator` 限制长边 1600 + `SaveFormat.JPEG(0.85)`，再上传
7. 图片 alt：插入当前取选中的文字（`selectionRef.current.text`）作为 alt
8. 错误提示细分：新增 `editor.imageUploadFailed` / `editor.linkInvalid` / `editor.photoPermission`
9. 能力补齐优先级：**unlink**（有链接没取消）> **h5/h6**（web 有、原生已支持）>
   checkbox 列表（`toggleCheckboxList` 已有，只差 UI）> 缩进 > 表格（不做）

### 第 3 步 · 结构与性能（2–3 天）

10. `onChangeText` 只在"空 ↔ 非空"翻转时 `setState`，其余写 ref（砍掉每键整页渲染）
11. 工具栏按职责拆文件：`toolbar/DefaultRow`、`toolbar/FormatRow`、`panels/*`、`sheets/*`
12. 编辑器宽度改为 `onLayout` 实测，回填/插图都用实测值
13. 撤销栈改「增量快照」：只存 `(index, html)` 的差量或按段落 hash 去重；上限按总字节数而非条数
14. 色板触摸目标 22 → 视觉不变、`hitSlop` 提到 11（44 总高）；chip 高 32 → 36 + hitSlop；
    色块加 i18n 色名

---

## 五、能力对齐表（web Quill vs 移动端）

| 能力 | web | 移动端 | 建议 |
| --- | --- | --- | --- |
| 加粗/斜体/下划线/删除线/行内码 | ✓ | ✓ | — |
| H1–H4 | ✓ | ✓ | — |
| H5 / H6 | ✓ | 原生支持、无 UI | **不做**（字号与正文差不开，已按要求撤掉） |
| 有序/无序列表 | ✓ | ✓ | — |
| checkbox 列表 | ✓ | 原生支持、**无 UI** | 补 |
| 引用 / 代码块 | ✓ | ✓ | — |
| 对齐 | ✓ | ✓ | — |
| 缩进 | ✓ | ✗ | 低优先 |
| 字号 / 字色 / 背景 | ✓ | ✓ | — |
| 链接 | ✓ | ✓ | 缺「取消链接」 |
| 图片 | ✓（块级+图注） | ✓（块级，已居中/圆角/留白） | 图注不做 |
| 表情 | ✓（`<img>` 行内） | ✓ 但**提交后被包成块** | 修（P0-1） |
| 分割线 | ✓（`<hr>`） | 折线文本 + 偷链 | 修（P0-2/3） |
| 视频 | ✓（嵌入） | 降级为链接 `▶ url` | 维持 |
| 内联文章 | ✓ | 降级为内部链接 | 维持 |
| 表格 | ✓ | ✗ | 不做 |
| 撤销/重做 | ✓（原生 undo） | 自建快照 | 见 P1-1/2 |

## 六、结构性风险与"不建议做"

1. **原生补丁已到 30 文件 / 1875 行**，升级 `react-native-enriched-html` 必然冲突。
   建议：补丁块首行统一加 `// [picart] 目的` 标记（现在只有行内注释），
   并把版本锁死在 `1.1.1`；有能力时把通用部分（行内样式、行高居中、图片圆角）提到上游。
2. **不建议把编辑器换成 WebView 版 Quill**：中文输入法候选、光标定位、滚动联动的问题
   会比现在多得多，现有原生方案的骨架是对的。
3. **不建议为对齐 web 去实现表格/缩进**：移动端收益低、原生成本高，写作场景也不匹配。
4. `lib/editorHtml.ts` 是纯字符串变换，**最适合补单测却一条都没有**。
   建议加 `vitest`（零 RN 环境），把这次的 emoji 用例、幂等用例固化成回归用例 ——
   这类 bug 光看代码看不出来。

## 七、验证清单（每步都要跑）

- 图文混排：正文里插表情 → 发布 → 网页端打开编辑，表情仍在行内、段落未拆
- 分割线：文末/文中/文首各插一次，位置正确；发布后 HTML 无 `href="#"`；撤销一步即消失
- 撤销栈：加粗两次（来回）后撤销按钮应自动变灰、无"死按钮"
- 回填幂等：`prepareArticleHtml(prepareArticleHtml(html)) === prepareArticleHtml(html)`
- 图片：4K 图上传后服务端文件 < 500KB，长边 ≤ 1600
- 类型切换：文章 ↔ 图片 ↔ 视频 来回切，正文与撤销栈都不串味

---

## 八、落地进度

### 2026-10-23 · 第 1 步（P0 止血）已完成

| 项 | 状态 | 改动 |
| --- | --- | --- |
| P0-1 行内表情被包成块级图 | ✅ | `toArticleHtml` 拆成三种输出（见下表），并对已包 wrapper 的图做幂等保护 |
| P0-2 分割线插到文首 | ✅ | `insertDivider` 改读实时 `selectionRef.current`，插入前 `focus + setSelection` 收口选区 |
| P0-3 分割线残留 `href="#"` | ✅（JS 兜底） | 提交前 `stripDividerAnchors` 剥掉；摘链后补 `onContentChanged()` 让撤销栈记到终态。原生 `insertDivider` 命令暂未做 |
| P1-1 canUndo 与实际历史不同步 | ✅ | `captureSnapshot` 收尾无条件 `syncHistoryState()` |

`toArticleHtml` 现在的判定规则：

| 场景 | 输出 |
| --- | --- |
| 独占一段 + 尺寸 ≤ 48（表情） | `<p><img class="ql-emoji" …></p>` |
| 独占一段 / 段落之外的大图 | `<div class="ql-image-wrapper"><img class="ql-image">…</div>` |
| 段内夹着文字 + 表情 | 原位 `<img class="ql-emoji">` |
| 段内夹着文字 + 大图 | 原位 `<img>`（不套 class，否则阅读页会把它缩成 32px） |
| 已带 `ql-image` class | 原样保留（幂等） |

回归用例（esbuild 打到 node 跑真实 HTML）：7 组场景输出正确，`toArticleHtml(toArticleHtml(x)) === toArticleHtml(x)`
在表情 / 块图 / 已包 wrapper 三种输入下均成立。

### 待办

- P1-3 字号基线（原生不回传字号，`A⁺/A⁻` 只能记住上次设置的值）
- P1-6 图片 alt —— **需要改原生**：`setImage(src, w, h)` 没有 alt 参数，
  span 也不带 alt，序列化出来就是空 alt。留给「补丁上游化」那批一起做。
- P2 全部、P3 全部

### 2026-10-23 · 第 2 步（P1）已完成

| 项 | 状态 | 改动 |
| --- | --- | --- |
| P1-2 撤销后光标丢失 | ✅ | `applyHistory` 记下 `selectionRef.start`，`setValue` 后 40ms 还原（越界由原生夹到末尾） |
| P1-5 插图不压缩 | ✅ | `lib/uploadImage.prepareContentImage`：长边 > 1600 等比缩放 + JPEG 0.85；小图不重编码 |
| P1-7 失败提示笼统 | ✅ | 新增 `publish.editor.photoPermission` / `imageUploadFailed`（zh + en） |
| P1-4 unlink | ✅ | 接 `onLinkDetected` → hook 里存 `activeLink` → 「更多」面板新增「移除链接」，光标不在链接里时置灰 |
| P1-4 h5 / h6 | ⛔ 已撤回 | 曾把 `HeadingLevel` 扩到 1–6，按要求删除：只保留 h1–h4。`ArticleRichTextInput` 的 `htmlStyle.h5/h6` 保留（web 端写好的 h5/h6 进编辑器仍有正确字号，只是不可选） |
| P1-4 checkbox 列表 | ✅ | 列表面板补「待办清单」按钮，用现成的 `toggleCheckboxList` |

### 2026-10-23 · 第 3 步（P2 / P3）已完成

| 项 | 状态 | 改动 |
| --- | --- | --- |
| P2-1 每键整页重渲染 | ✅ | 富文本纯文本改存 `richTextPlainRef`，只在「空 ↔ 非空」翻转时 `setState`（React 对相同值 bail out）；换类型/提交时现读 ref |
| P2-2 撤销栈内存 | ✅ | 在 50 条之上加 `HISTORY_MAX_CHARS = 200_000` 总字符上限，超了从最老的丢，至少留最新一份 |
| P3-1 触摸目标 | ✅ | 色块 22 → 26 + `hitSlop 9`（44）；面板 chip 32 → 36 + `hitSlop 4` |
| P3-2 色块读屏 | ✅ | 不再念 `rgb(...)`，改成「色系 + 档位」（9 个色系名走 i18n，如「绿色 3」） |

未做 / 有意保留：

- **P2-3 工具栏拆文件**：纯搬移，但 `styles` 与组件耦合，拆出去要同步拆 StyleSheet，
  视觉回归无法在这里验证 —— 建议单独开一轮、拆完对着真机过一遍。
- **P2-4 编辑器宽度硬编码**：`getEditorContentWidth` 依赖 `PAGE_PADDING * 2`，
  改成 `onLayout` 实测需要在编辑器挂载前就拿到宽度（回填早于布局），
  收益（分屏/平板）小于风险，暂缓。
- **P2-5 render 期 setState**（`panelReserve`）：这是 React 官方的
  「渲染期根据 props 调整 state」模式，带比较守卫、第二次渲染即收敛，**保留**。
- **P3-3 `allowFontScaling={false}`**：WYSIWYG 编辑器必须固定字号，
  否则存进去的 HTML 尺寸和显示不一致。属有意取舍，不改。


### 排版基准（一律按移动端来，不抄 web 的 px）

web 与移动端不是同一套度量：web 直接搬过来的 px 值会让 CJK 行挤、表情比正文还大。
统一收敛到下面这套，同一套值在**编辑器 / 阅读页 / 原生渲染**三处共用：

| 元素 | 基准 | 说明 |
| --- | --- | --- |
| 正文 | 16 / 26（1.6 倍） | 编辑器 `ArticleRichTextInput` 与纯文本正文输入一致 |
| 标题 h1–h6 | 22 / 20 / 18 / 16 / 15 / 14 | 行高 1.35（标题用略紧的比例） |
| 行内表情 | 正文 × 1.25 = 20 | `BODY_EMOJI_SCALE` / `BODY_EMOJI_SIZE`，编辑器插入、WebView `1.25em`、原生 `RenderHtml` 盒子三处同源 |
| 行内字号类 `ql-size-*` | 行高 = 字号 × 1.6 | 原来是 web 的 1.2 倍（13/16、20/24），中文上下会粘 |

- 编辑器表情插入：`EMOJI_INSERT_SIZE = BODY_EMOJI_SIZE`（原 22，与阅读页 32 打架）
- 阅读页 WebView：`img.emoji, img.ql-emoji { width: 1.25em; height: 1.25em }`
  —— 用 em 而不是 px，字号一变表情跟着变
- 原生 `RenderHtml`（评论 / 协议页）：表情盒子同样取 `BODY_EMOJI_SIZE`

> 历史数据：这次改动之前发布的文章，表情是被包成 `div.ql-image-wrapper` 的块级图，
> 仍旧显示为独占一行的大图；重新编辑保存一次后即转为行内表情。


