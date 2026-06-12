## Stage 1: Audit Gesture Viewer Behavior
**Goal**: Compare `GestureImageViewer` against article detail image interactions and identify missing logic.
**Success Criteria**: Missing behaviors are listed and mapped to concrete code changes.
**Tests**: Static code inspection of viewer entry points and overlay actions.
**Status**: Complete

## Stage 2: Complete Viewer Interaction Wiring
**Goal**: Implement the missing viewer interactions for article and comment variants.
**Success Criteria**: Viewer supports open-at-index, index sync, overlay toggling, original image upgrade, share/comment actions, and article navigation actions.
**Tests**: Type-check target file and verify referenced callbacks/props resolve.
**Status**: Complete

## Stage 3: Verify and Clean Up
**Goal**: Run focused validation and ensure implementation matches existing project patterns.
**Success Criteria**: No TypeScript errors introduced in touched code paths; plan updated to complete.
**Tests**: Focused `tsc`/lint or repo-supported validation command.
**Status**: Complete
