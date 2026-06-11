## Stage 1: Audit Existing Image Preview Flows
**Goal**: Identify current image preview implementations and define the shared viewer contract.
**Success Criteria**: Existing local modal/image preview code paths are located and the global viewer API is clear.
**Tests**: Verify affected entry points compile against the shared viewer API.
**Status**: In Progress

## Stage 2: Build Global Image Viewer Modal
**Goal**: Add a stack modal route backed by shared state for fullscreen image viewing.
**Success Criteria**: A fullscreen viewer route exists, opens from shared state, supports swiping between images, and closes cleanly.
**Tests**: Lint the new route/store and verify route registration compiles.
**Status**: Not Started

## Stage 3: Migrate Existing Entrypoints
**Goal**: Replace local image preview usage with the global viewer in primary image surfaces.
**Success Criteria**: Comment galleries and article image surfaces open the global viewer instead of local modal previews.
**Tests**: Lint updated components and confirm no removed APIs are still referenced.
**Status**: Not Started

## Stage 4: Verify And Clean Up
**Goal**: Remove obsolete local preview code and validate the final integration.
**Success Criteria**: No dead preview modal code remains and targeted lint passes.
**Tests**: Run eslint on touched files and review remaining warnings.
**Status**: Not Started
