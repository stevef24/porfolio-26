/**
 * JSX Namespace Declaration
 *
 * In React 19+ with TypeScript 5.5+ and the new JSX transform (jsx: "react-jsx"),
 * the global JSX namespace is no longer automatically available. This file
 * re-exports React's JSX namespace globally so that `JSX.Element` works
 * throughout the codebase without explicit imports.
 *
 * @see https://react.dev/blog/2024/04/25/react-19#typescript
 */

import type { JSX as ReactJSX } from "react";

declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
    type IntrinsicElements = ReactJSX.IntrinsicElements;
  }
}

export {};
