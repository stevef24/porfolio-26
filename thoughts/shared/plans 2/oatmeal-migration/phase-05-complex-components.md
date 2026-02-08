# Phase 5: Complex UI Components

## Overview

This phase updates complex shadcn/ui components (Dialog, Select, Dropdown Menu, Sidebar, Tabs, Sheet) with Oatmeal styling.

**Status**: Pending
**Dependencies**: Phase 1 (Foundation), Phase 4 (Core Components)
**Estimated Effort**: Medium-High
**Risk Level**: Medium

---

## Files to Modify

| File | Priority | Key Changes |
|------|----------|-------------|
| `components/ui/dialog.tsx` | High | 12px radius, shadows, overlay |
| `components/ui/select.tsx` | High | Dropdown styling, item states |
| `components/ui/dropdown-menu.tsx` | High | Menu styling, hover states |
| `components/ui/sidebar.tsx` | Medium | Sidebar colors from vars |
| `components/ui/tabs.tsx` | Medium | Tab list and trigger styling |
| `components/ui/sheet.tsx` | Medium | Panel styling, overlay |

---

## Task 5.1: Update Dialog Component

### File: `components/ui/dialog.tsx`

**Update DialogOverlay:**
```typescript
function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50",
        "bg-black/20", // Lighter overlay per Oatmeal
        "backdrop-blur-sm",
        // Animation
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}
```

**Update DialogContent:**
```typescript
function DialogContent({ className, children, showCloseButton = true, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50",
          "-translate-x-1/2 -translate-y-1/2",
          "w-full max-w-lg",
          "p-6", // 24px padding
          // Oatmeal styling
          "bg-card",
          "rounded-xl", // 12px - radius.lg for dialogs
          "border border-border",
          "shadow-lg", // Elevated shadow
          // Animation
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "duration-200",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-opacity">
            <Cancel01Icon size={16} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}
```

---

## Task 5.2: Update Select Component

### File: `components/ui/select.tsx`

**Update SelectTrigger:**
```typescript
function SelectTrigger({ className, size = "default", children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex items-center justify-between gap-2",
        "w-full",
        // Size variants
        size === "sm" ? "h-8 px-2.5 text-xs" : "h-10 px-3 text-sm",
        // Oatmeal styling
        "bg-transparent",
        "border border-input",
        "rounded-xs", // 2px radius (matches input)
        "text-foreground",
        "placeholder:text-muted-foreground",
        // States
        "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200",
        "[&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <UnfoldMoreIcon size={16} className="shrink-0 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
```

**Update SelectContent:**
```typescript
function SelectContent({ className, children, position = "popper", ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50",
          "min-w-[8rem] max-h-96",
          "overflow-hidden",
          // Oatmeal styling
          "bg-popover",
          "rounded-lg", // 8px
          "border border-border",
          "shadow-md",
          // Animation
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
```

**Update SelectItem:**
```typescript
function SelectItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex items-center gap-2",
        "w-full",
        "py-2 px-3 pr-8",
        "text-sm",
        // Oatmeal styling
        "rounded-md", // 8px for items
        "cursor-pointer select-none",
        "outline-none",
        // States
        "hover:bg-muted",
        "focus:bg-muted",
        "data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Tick02Icon size={16} className="text-primary" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
```

---

## Task 5.3: Update Dropdown Menu Component

### File: `components/ui/dropdown-menu.tsx`

**Update DropdownMenuContent:**
```typescript
function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50",
          "min-w-[8rem] max-h-[var(--radix-dropdown-menu-content-available-height)]",
          "overflow-y-auto overflow-x-hidden",
          // Oatmeal styling
          "bg-popover text-popover-foreground",
          "rounded-lg", // 8px
          "border border-border",
          "shadow-md",
          "p-1",
          // Animation
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}
```

**Update DropdownMenuItem:**
```typescript
function DropdownMenuItem({ className, inset, variant = "default", ...props }) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex items-center gap-2",
        "py-2 px-3",
        "text-sm",
        // Oatmeal styling
        "rounded-md",
        "cursor-pointer select-none",
        "outline-none",
        // Variants
        variant === "destructive"
          ? "text-destructive focus:bg-destructive/10"
          : "text-popover-foreground focus:bg-muted",
        // States
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        // Inset for items with icons
        inset && "pl-8",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  );
}
```

---

## Task 5.4: Update Tabs Component

### File: `components/ui/tabs.tsx`

**Update TabsList:**
```typescript
function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex items-center justify-center",
        "h-10 p-1",
        // Oatmeal styling
        "bg-muted",
        "rounded-lg", // 8px
        className
      )}
      {...props}
    />
  );
}
```

**Update TabsTrigger:**
```typescript
function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center",
        "px-4 py-1.5",
        "text-sm font-medium",
        // Oatmeal styling
        "rounded-md", // 8px for items
        "text-muted-foreground",
        "whitespace-nowrap",
        "transition-all duration-200",
        // Active state
        "data-[state=active]:bg-card",
        "data-[state=active]:text-foreground",
        "data-[state=active]:shadow-sm",
        // Hover
        "hover:text-foreground",
        // Focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
```

---

## Task 5.5: Update Sidebar Component

### File: `components/ui/sidebar.tsx`

**Key Updates:**
- Background uses `--sidebar` variable
- Border uses `--sidebar-border`
- Active items use `--sidebar-primary`

```typescript
// SidebarMenuButton active state update
"data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"

// SidebarMenuButton hover update
"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
```

---

## Task 5.6: Update Sheet Component

### File: `components/ui/sheet.tsx`

**Update SheetOverlay:**
```typescript
"bg-black/20 backdrop-blur-sm" // Lighter overlay
```

**Update SheetContent:**
```typescript
"bg-card border-border rounded-l-xl" // For side sheets
// or
"bg-card border-border rounded-t-xl" // For bottom sheets
```

---

## Verification Steps

### 1. Dialog Checks
- [ ] Rounded corners are 12px
- [ ] Shadow is prominent (lg)
- [ ] Overlay is subtle (20% black)
- [ ] Close button is visible
- [ ] Animation is smooth

### 2. Select Checks
- [ ] Trigger matches input styling (2px radius)
- [ ] Dropdown has 8px radius
- [ ] Selected item shows olive check
- [ ] Hover state shows muted background

### 3. Dropdown Menu Checks
- [ ] Menu has 8px radius
- [ ] Items have hover state
- [ ] Destructive items show red

### 4. Tabs Checks
- [ ] Tab list has muted background
- [ ] Active tab has card background
- [ ] Transition is smooth

### 5. Sidebar Checks
- [ ] Background uses sidebar variables
- [ ] Active items are olive colored
- [ ] Hover states work correctly

### 6. Sheet Checks
- [ ] Overlay is subtle
- [ ] Panel has rounded corner on entry side

---

## Commit Strategy

```bash
git add components/ui/dialog.tsx components/ui/select.tsx components/ui/dropdown-menu.tsx components/ui/sidebar.tsx components/ui/tabs.tsx components/ui/sheet.tsx
git commit -m "style(ui): update complex components with Oatmeal styling

Dialog:
- 12px radius (rounded-xl)
- Lighter overlay (20% black)
- Shadow-lg elevation

Select:
- Trigger: 2px radius (matches input)
- Dropdown: 8px radius
- Selected: primary color indicator

Dropdown Menu:
- 8px radius
- Muted hover states
- Destructive variant styling

Tabs:
- Muted background on list
- Card background on active
- Subtle shadow on active

Sidebar:
- Uses sidebar color variables
- Olive active states

Sheet:
- Rounded corners on entry side
- Subtle overlay"
```

---

## Next Steps

After Phase 5 completes:
- Phase 6 (Custom Components) can proceed
- Phase 7 (Blog Components) can proceed
