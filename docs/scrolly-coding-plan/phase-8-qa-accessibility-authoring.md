# Phase 8: QA, Accessibility, and Authoring Docs

## Objective
Define test coverage, accessibility standards, and authoring guidance.

## Detailed Plan
1. Functional QA
   - Active step changes only when a step crosses the center band.
   - Stage updates without flicker or layout jumps.
   - Magic Move transitions are visible and not double-animated.
2. Accessibility QA
   - Reduced motion removes scroll interpolation and token animation.
   - Step list is keyboard accessible and focus states are visible.
   - No invalid markup (no nested buttons).
3. Performance QA
   - No long tasks during scroll.
   - Token payload size stays within reasonable limits.
4. Authoring docs
   - Publish and reference the LLM authoring guide.
   - Provide a short authoring checklist for human writers.

## Deliverables
- Test checklist for functional, accessibility, and performance.
- Authoring checklist and LLM guide link.

## Resources
- `docs/scrolly-coding-plan/llm-authoring-guide.md`
