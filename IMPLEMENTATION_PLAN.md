## Stage 1: Layout Baseline
**Goal**: Measure the profile screen height and give the nested tab content a stable minimum height.
**Success Criteria**: TabView and tab lists fill the visible area without relying on fixed magic heights.
**Tests**: TypeScript check and profile screen smoke review.
**Status**: In Progress

## Stage 2: Hero Layering
**Goal**: Put the cover image below the scroll content and let the scroll sheet's real top radius cover it.
**Success Criteria**: The fake rounded cap is removed, while mask, collapsed bar, avatar, and action controls remain visible.
**Tests**: TypeScript check and visual smoke review.
**Status**: Not Started

## Stage 3: Pull Stretch
**Goal**: Link pull distance to the hero stretch and scroll content offset for a flexible-space style interaction.
**Success Criteria**: Up-scroll collapses to a minimum height; pull-down stretches the hero and pushes content downward.
**Tests**: TypeScript check and lint.
**Status**: Not Started

## Stage 4: Pull Gesture Reliability
**Goal**: Make the profile pull-down respond immediately without terminating mid-gesture.
**Success Criteria**: Pull-down starts from a light drag at the top, keeps tracking until release, and still allows tab swipes and normal list scrolling.
**Tests**: TypeScript check and lint.
**Status**: Complete
