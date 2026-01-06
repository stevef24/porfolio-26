# Phase 6: Blog Integration and TOC Strategy

## Objective
Integrate scrollycoding into blog posts without breaking the existing layout and TOC system.

## Detailed Plan
1. Frontmatter flag
   - Add `scrolly: true` to blog post frontmatter when using scrollycoding.
2. Blog page behavior
   - If `scrolly: true`, do not render `RulerTOC` or `MobileFloatingTOC`.
   - Use the scrolly step list as the primary navigation column.
3. Server/client boundary
   - Compile Magic Move tokens in the server page component.
   - Pass `steps` and `compiledSteps` into a client component renderer.
4. MDX authoring
   - Import the typed steps array into the MDX file.
   - Render `<ScrollyCoding steps={steps} compiledSteps={compiledSteps} />`.
5. Layout adjustments
   - Ensure the scrolly grid uses full content width when TOC is hidden.
   - Keep the blog header and footer unchanged.

## Deliverables
- Clear blog layout decision tree for scrolly posts vs standard posts.
- MDX authoring instructions aligned with the typed steps array.

## Resources
- `app/blog/[slug]/page.tsx`
- `components/ui/blog/RulerTOC.tsx`
- `components/ui/blog/MobileFloatingTOC.tsx`
- `lib/custom-components.tsx`
- `CLAUDE.md`
