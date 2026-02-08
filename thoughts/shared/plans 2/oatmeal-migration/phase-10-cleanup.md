# Phase 10: Cleanup & Verification

## Overview

This is the final phase. It includes cleanup of duplicate files, searching for remaining hardcoded colors, full visual QA, and final build verification.

**Status**: Pending
**Dependencies**: All previous phases (1-9)
**Estimated Effort**: Medium
**Risk Level**: Low

---

## Tasks Overview

| Task | Priority | Description |
|------|----------|-------------|
| 10.1 | High | Delete duplicate SwissGridBackground files |
| 10.2 | High | Search for remaining hardcoded colors |
| 10.3 | High | Full visual QA checklist |
| 10.4 | Critical | Build verification |
| 10.5 | Medium | Update continuity ledger |

---

## Task 10.1: Delete Duplicate Files

### Check for Duplicates

```bash
# List all SwissGridBackground files
ls -la components/ui/SwissGridBackground*.tsx

# Expected output should show only:
# SwissGridBackground.tsx

# If duplicates exist:
# SwissGridBackground 2.tsx
# SwissGridBackground 3.tsx
# SwissGridBackground 4.tsx
```

### Delete Duplicates

```bash
# Remove duplicate files (if they exist)
rm -f "components/ui/SwissGridBackground 2.tsx"
rm -f "components/ui/SwissGridBackground 3.tsx"
rm -f "components/ui/SwissGridBackground 4.tsx"
```

---

## Task 10.2: Search for Remaining Hardcoded Colors

### Search Commands

```bash
# Search for OKLCH colors (should be zero after migration)
grep -r "oklch(" components/ --include="*.tsx" --include="*.ts"

# Search for old lime green hex values
grep -r "#f5f57\|#a3e635\|#84cc16" components/ --include="*.tsx"

# Search for old background colors
grep -r "#fafafa\|#ffffff\|#121212\|#161616\|#1a1a1a" components/ --include="*.tsx"

# Search for old gray colors that should be muted
grep -r "#999\|#666\|#333\|#ccc\|#ddd\|#eee" components/ --include="*.tsx"

# Search in globals.css for any remaining issues
grep "oklch\|#fafafa\|#121212" app/globals.css
```

### Expected Results

After migration, the only colors in components should be:
- CSS variable references: `var(--something)`
- Oatmeal hex colors: `#f8f6ef`, `#0e0e0c`, `#566240`, `#6f7c5a`, etc.
- Tailwind classes: `text-foreground`, `bg-primary`, etc.

### Fix Any Remaining Issues

If hardcoded colors are found:
1. Replace with appropriate CSS variable
2. Or replace with Oatmeal hex color
3. Test the component after change

---

## Task 10.3: Full Visual QA Checklist

### Start Dev Server

```bash
pnpm dev
```

### Homepage QA

**Hero Section**
- [ ] Background is warm cream (#f8f6ef) in light mode
- [ ] Background is deep charcoal (#0e0e0c) in dark mode
- [ ] Hero text uses Instrument Serif
- [ ] Hero text is near-black (#19170f) in light mode
- [ ] Subheading text is muted (#5f5a48)

**Cards & Links**
- [ ] MidCards have 8px radius
- [ ] Hover shows warm muted background
- [ ] Links hover to olive (#566240)
- [ ] Arrow icons animate on hover

**Sections**
- [ ] Sections alternate backgrounds correctly
- [ ] Accent line is olive green
- [ ] Typography hierarchy is clear

**Footer**
- [ ] Border is subtle (#e3e0d5)
- [ ] Text is muted-foreground
- [ ] Back to top hovers to olive

### Blog Listing Page QA

- [ ] Post cards have correct styling
- [ ] Dates use label styling
- [ ] Hover states work

### Blog Post Page QA

**Article Content**
- [ ] Headings use Instrument Serif
- [ ] Body text is comfortable to read
- [ ] Links are olive with underline
- [ ] Blockquotes have olive border
- [ ] Code blocks have muted background

**TOC Components**
- [ ] Active indicator is olive
- [ ] Inactive items are muted
- [ ] Hover transitions work
- [ ] Mobile TOC pill is styled correctly

**Scrolly Coding (if present)**
- [ ] Focus lines are olive (not lime)
- [ ] Stage background is warm cream/dark muted
- [ ] Filename badge is readable
- [ ] Step cards show correct opacity states
- [ ] Controls hover to olive

### Navigation QA

- [ ] Header/Navbar glass effect has warm tint
- [ ] Active link indicator is olive
- [ ] Theme toggle works correctly
- [ ] CTA button is pill-shaped with solid fill

### Dark Mode QA (repeat all above)

Toggle to dark mode and verify:
- [ ] All backgrounds invert correctly
- [ ] Text has sufficient contrast
- [ ] Olive accent is lighter (#6f7c5a)
- [ ] Borders are visible but subtle
- [ ] No white flashes on page load

### Responsive QA

Test at:
- [ ] Desktop (1440px+)
- [ ] Laptop (1024px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

Check:
- [ ] Typography scales correctly
- [ ] Cards stack on mobile
- [ ] Navigation collapses appropriately
- [ ] TOC switches to mobile variant
- [ ] Scrolly uses mobile layout

### Accessibility QA

- [ ] Focus rings are visible (olive)
- [ ] Focus order is logical
- [ ] Sufficient color contrast
- [ ] Reduced motion is respected

---

## Task 10.4: Build Verification

### Run Production Build

```bash
pnpm build
```

### Expected Output

```
✓ Compiled successfully
✓ Linting and checking validity
✓ Generating static pages (XX/XX)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    ...      ...
├ ○ /blog                                ...      ...
├ ○ /blog/[slug]                         ...      ...
└ ...

○ (Static)   prerendered as static content
```

### Verify Build Artifacts

```bash
# Check that the build completed
ls -la .next/

# Optional: Run production server locally
pnpm start
```

### Address Any Build Errors

If errors occur:
1. Check the error message
2. Identify the file and line
3. Fix the issue
4. Re-run build

---

## Task 10.5: Update Continuity Ledger

### File: `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md`

Update the ledger to reflect Oatmeal migration:

```markdown
## Oatmeal Design System Migration

**Completed**: [Date]

### Summary
- Migrated from Swiss minimalism to Oatmeal design system
- Replaced Playfair Display with Instrument Serif
- Removed canvas noise background
- Changed accent from lime green to olive
- Updated all components with new styling

### Color Palette Applied
- Background: #f8f6ef / #0e0e0c
- Primary: #566240 / #6f7c5a
- Text: #19170f / #f8f6ef
- Muted: #5f5a48 / #a19b86

### Files Modified
- app/globals.css
- app/layout.tsx
- components/ui/SwissGridBackground.tsx
- components/ui/button.tsx
- components/ui/card.tsx
- ... (list all modified files)

### Verification
- Build: ✓ Passes
- Visual QA: ✓ Complete
- Dark Mode: ✓ Working
- Accessibility: ✓ Focus rings visible
```

---

## Final Commit Strategy

```bash
# Stage all remaining changes
git add -A

# Final cleanup commit
git commit -m "style(oatmeal): complete Oatmeal design system migration

Phase 10 - Final cleanup and verification:
- Removed duplicate SwissGridBackground files
- Verified no remaining hardcoded lime green colors
- Full visual QA passed in light and dark modes
- Build verification successful
- Updated continuity ledger

Migration Summary:
- Font: Playfair Display → Instrument Serif
- Background: Canvas noise → Clean smooth
- Accent: Lime green → Olive green (#566240)
- All 10 phases completed successfully"
```

---

## Post-Migration Notes

### What Changed

| Aspect | Before | After |
|--------|--------|-------|
| Display Font | Playfair Display | Instrument Serif |
| Body Font | Inter | Inter (unchanged) |
| Background | Canvas noise + grain | Clean, smooth |
| Light BG | Near white | Warm cream (#f8f6ef) |
| Dark BG | Pure black | Deep charcoal (#0e0e0c) |
| Accent | Lime green | Olive green (#566240) |
| Cards | Sharp corners | 8px radius |
| Buttons | Various radii | Pill (9999px) |
| Shadows | Minimal | Oatmeal scale (sm/md/lg) |

### What Stayed the Same

- Motion spring physics
- Component architecture
- Page structure
- Accessibility features
- Responsive breakpoints

---

## Rollback Instructions

If critical issues are discovered after merge:

```bash
# Find the commit before migration started
git log --oneline -20

# Revert to that commit (replace HASH)
git revert HASH..HEAD

# Or reset completely (destructive)
git reset --hard HASH
```

---

## Celebration Checklist

After successful migration:
- [ ] All phases complete
- [ ] Build passes
- [ ] Visual QA passes
- [ ] Dark mode works
- [ ] No console errors
- [ ] Ready for production
