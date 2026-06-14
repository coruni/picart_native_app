## Stage 1: Inspect Refresh Paths
**Goal**: Confirm where comment skeletons and article refreshes are triggered.
**Success Criteria**: `ArticleCommentList` and article detail fetch flow are reviewed.
**Tests**: Trace initial load, refresh signal, and article refresh code paths.
**Status**: Complete

## Stage 2: Stabilize Comment Refresh UX
**Goal**: Prevent comment skeletons from reappearing on every refresh.
**Success Criteria**: Skeleton only appears on initial bootstrap, while later refreshes reuse existing comments until new data arrives.
**Tests**: Review `refreshSignal` and article/sort change behavior.
**Status**: In Progress

## Stage 3: Preserve Article Content References
**Goal**: Avoid re-rendering article media/content when refresh returns unchanged content.
**Success Criteria**: Pull-to-refresh compares article content before replacing render-critical fields.
**Tests**: Review merged article update flow and cache writes.
**Status**: Not Started
