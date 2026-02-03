# Phase 2: CodeCanvas Component

## Goal
Create reusable canvas wrapper with toolbar + Magic Move.

## Stages

### Stage 2.1: Component Shell
Create `components/ui/scrolly/CodeCanvas.tsx` with basic structure.

### Stage 2.2: Header with Filename Badge
- Filename badge on left
- Style: `bg-muted/50 text-xs font-mono`

### Stage 2.3: Toolbar Integration
- Import existing `StageControls`
- Position at top-right
- Pass copy/fullscreen handlers

### Stage 2.4: Magic Move Code Area
- Import `ShikiMagicMoveRenderer`
- Get tokens for current theme
- Animate on step change

### Stage 2.5: Fullscreen Modal
- Wire up `StageFullscreen` component
- Toggle via toolbar button

## Deliverables
- [ ] `CodeCanvas.tsx` created (~150 lines)
- [ ] Filename badge displays
- [ ] Toolbar renders
- [ ] Code renders with syntax highlighting
- [ ] Fullscreen modal works
