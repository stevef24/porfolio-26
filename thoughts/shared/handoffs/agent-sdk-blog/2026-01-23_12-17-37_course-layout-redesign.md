---
date: 2026-01-23T12:17:37+07:00
session_name: agent-sdk-blog
researcher: Claude
git_commit: e55ce80
branch: scrollyCoding
repository: porfolio-26
topic: "Course Layout Redesign - 3-Column animations.dev-inspired Layout"
tags: [implementation, course-layout, sidebar, responsive, css-grid]
status: fixes-applied
last_updated: 2026-01-23
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: Course Layout Redesign (Needs Visual Refinement)

## Task(s)

**Completed:**
- [x] Phase 1: Created `CourseShell.tsx` - main 3-column layout wrapper
- [x] Phase 2: Created `CourseSidebarDesktop.tsx` - always-visible 240px sidebar
- [x] Phase 3: Created `CourseSidebarMobile.tsx` + `MobileSidebarTrigger.tsx` - sheet drawer for mobile
- [x] Phase 4: Updated lesson/course pages with content width constraints
- [x] Phase 5: Created `LessonTOC.tsx` - right-side table of contents
- [x] Phase 6: Added CSS variables to globals.css

**Needs Attention (current state):**
- [ ] Visual refinement - excessive whitespace at top
- [ ] Sidebar positioning not aligned properly with content
- [ ] Mobile header showing on desktop (should be hidden)
- [ ] Content starting too low on the page
- [ ] Overall polish and consistency check

## Critical References
1. `app/globals.css:147-153` - Course layout CSS variables
2. `components/courses/CourseShell.tsx` - Main layout component (has issues)
3. Target design: https://animations.dev/learn/animation-theory/intro

## Recent changes
- `components/courses/CourseShell.tsx:1-116` - NEW - Main 3-column layout wrapper
- `components/courses/CourseSidebarDesktop.tsx:1-207` - NEW - Desktop sidebar
- `components/courses/CourseSidebarMobile.tsx:1-192` - NEW - Mobile sheet sidebar
- `components/courses/MobileSidebarTrigger.tsx:1-26` - NEW - Hamburger button
- `components/courses/LessonTOC.tsx:1-105` - NEW - Right-side TOC
- `app/courses/[slug]/page.tsx:1-147` - Updated to use CourseShell
- `app/courses/[slug]/lessons/[lesson]/page.tsx:1-210` - Updated to use CourseShell
- `app/globals.css:147-153` - Added course layout CSS variables

## Learnings

1. **Header is positioned at bottom**: The site's `Header` component is `fixed bottom-0` (floating pill at bottom). The course layout needs to account for this - no navbar height at top needed.

2. **Mobile header appearing on desktop**: The `MobileHeader` in CourseShell has `md:hidden` but it's still showing. Need to verify the responsive breakpoints.

3. **Sidebar sticky positioning**: The desktop sidebar uses `sticky top-[var(--navbar-height)]` but since the navbar is at the bottom, this creates excess space at the top.

4. **Content structure**: CourseShell renders Header which might be duplicating with the existing site Header.

## Post-Mortem (Required for Artifact Index)

### What Worked
- Component architecture is solid - separate Desktop/Mobile sidebars
- CSS variables for layout tokens allow easy tuning
- TypeScript compilation passes
- Build passes successfully

### What Failed
- **Visual alignment**: Content starts too low, excessive top padding
- **Sticky positioning**: Sidebar `top-[var(--navbar-height)]` is wrong since navbar is at bottom, not top
- **Header duplication**: CourseShell includes `<Header />` but this may duplicate the global header
- **Mobile header visibility**: Shows on desktop when it shouldn't

### Key Decisions
- Decision: Bypass SiteShell entirely for courses
  - Alternatives: Modify SiteShell to support always-expanded sidebar
  - Reason: SiteShell's collapsible behavior was core to the problem

- Decision: Use CSS variables for layout dimensions
  - Reason: Allows easy tuning and consistency

## Artifacts
- `components/courses/CourseShell.tsx` - Main layout (needs fix)
- `components/courses/CourseSidebarDesktop.tsx` - Desktop sidebar
- `components/courses/CourseSidebarMobile.tsx` - Mobile sidebar
- `components/courses/MobileSidebarTrigger.tsx` - Hamburger
- `components/courses/LessonTOC.tsx` - TOC component
- `app/globals.css:147-153` - CSS variables

## Action Items & Next Steps

### Fixes Applied This Session:
1. **Fixed sidebar sticky position** - Changed from `top-[var(--navbar-height)]` to `top-0` (navbar is at bottom)
2. **Fixed sidebar height** - Changed from `h-[calc(100vh-var(--navbar-height))]` to `h-screen`
3. **Fixed TOC positioning** - Changed from complex calc to `sticky top-8`
4. **Added bottom padding** - Added `pb-24` to main content for floating navbar

### Still Needs Testing:
- Visual verification in browser
- Mobile hamburger menu and sheet drawer
- Compare with animations.dev layout for final polish
- Verify no header duplication issues

## Other Notes

**Key Files to Review:**
- `components/layout/Header.tsx` - Navbar is `fixed bottom-0`, not top
- `app/layout.tsx` - Check if Header is globally rendered
- `components/courses/CourseShell.tsx:30-40` - MobileHeader component

**CSS Variables Added:**
```css
--course-sidebar-width: 240px;
--course-content-width: 700px;
--course-toc-width: 200px;
--course-gap: 2rem;
```

**Screenshot Analysis (from user):**
- Excessive whitespace at top of page
- Sidebar appears cut off (only shows 3 lessons of Module 01)
- Content positioning is off from ideal
- Needs overall visual polish
