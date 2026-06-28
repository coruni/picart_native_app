# 同步 search 页面 tabbar 样式与 profile tabbar 样式

## Summary

`app/search/index.tsx` 的 TabBar（article/topic/user 三个 tab）在 `renderTabBarItem` 与 `renderIndicator` 中引用了 `styles.tabItem`、`styles.tabLabel`、`styles.tabIndicator`，但这三个样式键在文件末尾的 `StyleSheet.create` 中**根本没有定义**（只有一个未被引用的 `styles.indicator`）。结果是 tab 项没有内边距、label 没有 fontWeight、指示条没有 position/尺寸，整体外观与 profile 页面的 tabbar 不一致。

本次任务将 search 页面的 tabbar 样式与 `app/(tabs)/profile.tsx` 的 tabbar 样式完全对齐。

## Current State Analysis

### Profile tabbar（参考样式，`app/(tabs)/profile.tsx`）

样式定义（L897–L924）：
```js
tabBar: {
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: StyleSheet.hairlineWidth,
  marginHorizontal: 4,
},
tabStyle: { width: "auto", minWidth: 60 },
tabItem: {
  paddingHorizontal: 12,
  paddingVertical: 12,
  alignItems: "center",
  justifyContent: "center",
},
tabLabel: { fontWeight: "600" },
tabIndicator: {
  position: "absolute",
  bottom: 4,
  left: 0,
  width: 20,
  height: 4,
  borderRadius: 2,
  backgroundColor: "#6680ff",   // #6680ff === colors.primary（constants/theme.ts L36）
},
```

`renderIndicator`（L585–L592）不在内联覆盖 backgroundColor，完全依赖 `styles.tabIndicator`：
```jsx
<Animated.View style={[styles.tabIndicator, { transform: [{ translateX }] }]} />
```

### Search tabbar（待修复，`app/search/index.tsx`）

样式定义（L822–L835）：
```js
tabBar: { elevation: 0, shadowOpacity: 0 },          // 缺 borderBottomWidth、marginHorizontal
tabStyle: { width: "auto", minWidth: 80 },           // minWidth 80 ≠ 60
indicator: { height: 3, borderRadius: 2, width: 20, marginLeft: 30 },  // 错误命名 + 未使用
// tabItem、tabLabel、tabIndicator 全部缺失
```

`renderIndicator`（L506–L512）引用了未定义的 `styles.tabIndicator`，并通过内联 `backgroundColor: colors.primary` 兜底：
```jsx
<Animated.View
  style={[
    styles.tabIndicator,   // undefined → 无样式
    { backgroundColor: colors.primary, transform: [{ translateX }] },
  ]}
/>
```

`renderTabBarItem`（L514–L533）引用了未定义的 `styles.tabItem` 与 `styles.tabLabel`：
```jsx
<Pressable style={styles.tabItem} ...>       // undefined → 无 padding
  <Animated.Text style={[styles.tabLabel, ...]}>  // undefined → 无 fontWeight
```

### 差异对照表

| 样式键 | Profile（目标） | Search（现状） |
|---|---|---|
| `tabBar` | `+ borderBottomWidth: hairlineWidth, marginHorizontal: 4` | 缺这两项 |
| `tabStyle` | `minWidth: 60` | `minWidth: 80` |
| `tabItem` | 已定义（padding 12/12、居中） | **未定义** |
| `tabLabel` | `fontWeight: "600"` | **未定义** |
| `tabIndicator` | 已定义（absolute/bottom4/20×4/radius2/#6680ff） | **未定义** |
| `indicator` | 不存在 | 存在但未被引用（死代码） |
| 指示条内联 bg | 无（依赖 style） | `colors.primary` 内联覆盖 |

> 注：`colors.primary === "#6680ff"`（见 `constants/theme.ts` L36），两种写法视觉等价；为与 profile 结构一致，将 bg 放入 style 并移除内联覆盖。

## Proposed Changes

仅修改一个文件：`app/search/index.tsx`。

### 1. 替换 StyleSheet 中的 tabbar 相关样式（L822–L835）

将：
```js
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  tabStyle: {
    width: "auto",
    minWidth: 80,
  },
  indicator: {
    height: 3,
    borderRadius: 2,
    width: 20,
    marginLeft: 30,
  },
```

改为（与 profile 完全一致）：
```js
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 4,
  },
  tabStyle: {
    width: "auto",
    minWidth: 60,
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 4,
    left: 0,
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6680ff",
  },
```

要点：
- `tabBar` 补 `borderBottomWidth` 与 `marginHorizontal`。
- `tabStyle` 的 `minWidth` 由 80 改为 60。
- 删除未被引用的 `indicator`。
- 新增 `tabItem`、`tabLabel`、`tabIndicator`，定义与 profile 一致。

### 2. 简化 `renderIndicator` 的内联样式（L506–L512）

将：
```jsx
<Animated.View
  style={[
    styles.tabIndicator,
    { backgroundColor: colors.primary, transform: [{ translateX }] },
  ]}
/>
```

改为（与 profile 一致，移除冗余的 backgroundColor 内联覆盖）：
```jsx
<Animated.View
  style={[styles.tabIndicator, { transform: [{ translateX }] }]}
/>
```

### 不改动的部分

- `renderTabBar` 的 `{...props}` 展开写法保留（与 profile 的显式 prop 写法功能等价，无需改动）。
- `renderTabBarItem` 的 JSX 结构已经与 profile 一致，补齐样式定义后即自动生效，无需改动 JSX。
- 不修改 `colors.primary` 的语义（仍由 theme 提供），仅将字面量 `#6680ff` 放入 style 以匹配 profile 的写法。

## Assumptions & Decisions

1. **以 profile 为唯一参考**：用户明确要求「同步 profile tabbar 样式」，故所有样式键的值以 `app/(tabs)/profile.tsx` 为准。
2. **`#6680ff` 与 `colors.primary` 等价**：已在 `constants/theme.ts` L36 确认 `primary: "#6680ff"`。选择将 `#6680ff` 写入 style 并移除内联覆盖，是为了与 profile 的代码结构完全对齐，便于后续统一维护。
3. **不重构 `{...props}` 写法**：search 页的 `renderTabBar` 用 `{...props}` 接收 TabView 注入的 `navigationState`/`position` 等，与 profile 的显式写法功能等价，不属于样式同步范畴。
4. **不修改其它页面**：`topic/[id].tsx`、`user/[id].tsx`、`(tabs)/index.tsx`、`(tabs)/circle/_layout.tsx` 已使用 `#6680ff` 的 `tabIndicator` 模式，无需改动。

## Verification

1. 启动开发服务器，进入 search 页面，提交一个关键词触发搜索结果态（显示 article/topic/user 三个 tab）。
2. 对照 profile 页面的 tabbar，确认：
   - tab 文字使用 600 字重，选中态为 `colors.primary`、未选中为 `theme.secondary`。
   - tab 项有 12/12 内边距，点击区域与 profile 一致。
   - 指示条为 20×4 圆角条，位于 tab 底部（bottom: 4），颜色为 `#6680ff`，随滑动/切换平滑位移。
   - tabbar 底部有 hairline 分隔线，左右有 4 的 margin。
   - tab 最小宽度为 60（与 profile 一致）。
3. 切换 article / topic / user 三个 tab，确认指示条位移与 swipe 手势正常。
4. 在亮色与暗色主题下分别检查，确认配色随主题切换正确。
