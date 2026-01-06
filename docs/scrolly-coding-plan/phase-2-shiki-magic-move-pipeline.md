# Phase 2: Shiki Magic Move Token Pipeline

## Objective
Precompile Magic Move tokens on the server so the client only renders animated tokens.

## Detailed Plan
1. Server-only compiler
   - Create a server helper (e.g., `lib/scrolly/compile-steps.ts`).
   - Initialize a Shiki highlighter once per process and cache it.
   - Use `createMagicMoveMachine` + `codeToKeyedTokens` from `shiki-magic-move/core`.
2. Theme alignment
   - Default to `vitesse-light` and `vitesse-dark`.
   - Allow per-doc theme overrides from `ScrollyCodeDoc`.
3. Language handling
   - Validate `lang` against available Shiki languages.
   - Provide clear error output if a language is missing.
4. Compiled token output
   - Generate a compiled token step for each code string.
   - Ensure output is serializable (plain objects, arrays, numbers, strings).
5. Client rendering strategy
   - Use `ShikiMagicMovePrecompiled` from `shiki-magic-move/react`.
   - Pass `steps={compiledSteps}` and `step={activeIndex}`.
   - Disable animation for reduced motion.
6. Styling
   - Import `shiki-magic-move/dist/style.css` in a global location.
   - Ensure the scrolly code panel styles do not conflict with global code blocks.
7. Fallbacks
   - If compilation fails, render a static code block (no Magic Move).
   - Log build-time errors early to avoid silent failures.

## Deliverables
- Server-only compiler spec and caching strategy.
- Client rendering contract with precompiled tokens.
- Theme and language validation rules.

## Resources
- https://github.com/shikijs/shiki-magic-move
- https://shiki-magic-move.netlify.app/
- `source.config.ts`
- `package.json`
