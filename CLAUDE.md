# Portfolio Project - Claude Code Instructions

## Project Overview

A Swiss minimalism-inspired developer portfolio built with Next.js 16, featuring a blog system powered by Fumadocs MDX.

## Tech Stack

- **Framework**: Next.js 16.1.0 (App Router, Turbopack)
- **Language**: TypeScript 5 (strict mode)
- **Package Manager**: PNPM
- **Styling**: Tailwind CSS 4, OKLCH color system
- **Animations**: Motion (Framer Motion v12) with spring physics
- **UI Components**: shadcn/ui (radix-lyra preset), Radix UI, Base UI
- **Icons**: HugeIcons
- **Content**: Fumadocs Core + MDX for blog
- **Theme**: next-themes (dark/light mode)

## Project Structure

```
app/                  # Next.js App Router pages
  blog/               # Blog listing and [slug] pages
components/
  layout/             # Navbar, ThemeToggle
  landing/            # Home, Contact sections
  shared/             # BlurFade, BlurText animations
  ui/                 # shadcn components + custom (MidCard, SwissGridBackground)
  blog/               # BlogPostsList, StickyTOCSidebar
lib/
  source.ts           # Fumadocs blog loader (SERVER-ONLY)
  utils.ts            # cn() utility
  motion-variants.ts  # Animation presets
  custom-components.tsx # MDX component overrides
content/blog/         # MDX blog posts
```

## Critical Patterns

### Server/Client Separation

**IMPORTANT**: `lib/source.ts` uses `fumadocs-mdx` which requires Node.js `fs/promises`. It must ONLY be imported in Server Components.

```typescript
// CORRECT: Server Component (no "use client")
import { blog } from "@/lib/source";

// WRONG: Client Component with "use client"
"use client";
import { blog } from "@/lib/source"; // Will break!
```

**Pattern for client-side animations with server data:**
1. Fetch data in Server Component
2. Pass serializable data as props to Client Component
3. Client Component handles animations

### Animation Conventions

- Use Motion library with spring presets from `lib/motion-variants.ts`
- Always check `useReducedMotion()` for accessibility
- Stagger animations: 50-150ms between elements
- Use `BlurFade` wrapper for scroll-triggered animations

```typescript
import { springGentle, springBouncy } from "@/lib/motion-variants";
```

### Styling Conventions

- **Typography Classes** (hierarchy order):
  - `text-swiss-hero` - Large display headings (Playfair, 44-64px)
  - `text-swiss-subheading` - Section titles (uppercase, 11px, foreground color, 600 weight)
  - `text-swiss-title` - Card/article titles (Playfair, 24px)
  - `text-swiss-body` - Body paragraphs (16px, muted-foreground, 1.7 line-height)
  - `text-swiss-label` - Metadata/utility text (uppercase, 11px, muted)
  - `text-swiss-caption` - Supplementary text (13px, muted)
- **Fonts**: Playfair Display (display), Geist (body/subheadings)
- **Grid**: 64px baseline mathematical grid
- **Colors**: OKLCH color space (see `globals.css`)
- **Corners**: Minimal rounding (0-2px)

Use the `cn()` utility for conditional classes:
```typescript
import { cn } from "@/lib/utils";
cn("base-class", condition && "conditional-class")
```

## Common Commands

```bash
pnpm dev          # Start dev server (port 3000)
pnpm build        # Production build
pnpm lint         # Run ESLint
```

## Blog Content

Blog posts are MDX files in `content/blog/`. Frontmatter:

```yaml
---
title: Post Title
description: Post description
author: Author Name
date: 2025-01-01
---
```

## Important Notes

1. **Port 3000**: Kill any process on port 3000 before starting dev server
2. **Fumadocs MDX**: Only import in Server Components
3. **Animations**: Respect `prefers-reduced-motion` in all animations
4. **TypeScript**: Strict mode - fix all type errors
5. **Build verification**: Always run `pnpm build` before committing

## Component Patterns

### Creating New UI Components

```typescript
"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

interface ComponentProps {
  className?: string;
}

export function Component({ className }: ComponentProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("base-styles", className)}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      Content
    </motion.div>
  );
}
```

### Adding Blog Features

When adding features that need blog data:
1. Keep the page as a Server Component
2. Create a separate Client Component for interactivity
3. Transform/serialize data before passing to client
