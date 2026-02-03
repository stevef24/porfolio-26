# Devouring Details Design Patterns

Research conducted via Chrome browser automation on https://devouringdetails.com/prototypes/nextjs-dev-tools

## Layout Architecture

### Full-Width Scrollytelling
- **Container**: Full viewport width (100vw)
- **Column Split**: 50/50 (left narrative: 49.8%, right stage: 49.0%)
- **Left Column Padding**: 48px horizontal padding
- **Right Column Background**: `rgb(248, 248, 248)` - subtle gray (#f8f8f8)
- **Sticky Behavior**: Right column (stage) is sticky, left column scrolls

### Centered Text (Non-Scrolly Sections)
- When no code stage present, content centers in single column
- Max-width constraint applied for readability
- Used at page end for resources/links section

## Typography System

### Body/Paragraph Text
| Property | Value |
|----------|-------|
| Font Family | "DD" (custom), system-ui fallback |
| Font Size | **20px** (larger than typical 16px) |
| Line Height | **38px** (1.9 ratio - very generous) |
| Font Weight | **500** (medium) |
| Color | `rgb(23, 23, 23)` - not pure black |
| Letter Spacing | normal |

### Section Labels (e.g., "FOCUS RINGS")
| Property | Value |
|----------|-------|
| Font Family | Monospace (Menlo) |
| Font Size | 14px |
| Font Weight | 400 |
| Text Transform | **uppercase** |
| Color | `rgb(111, 111, 111)` - medium gray |
| Letter Spacing | normal (slightly spaced visually) |

### Code Blocks
| Property | Value |
|----------|-------|
| Font Family | "JetBrains Mono", Menlo, monospace |
| Font Size | 16px |
| Line Height | **38px** (matches paragraph - consistent rhythm) |
| Background | Cream/beige (`rgb(243, ...)` - warm off-white) |
| Border | None or very subtle |
| Border Radius | Minimal (4-6px) |
| Padding | Generous internal padding |

### Inline Code
- Background: Light gray
- Font: Monospace
- Padding: Small horizontal padding
- Border-radius: Minimal

### Keyboard Keys (e.g., `Tab`, `Enter`)
- Bordered box styling
- Monospace font
- Subtle border
- Appears inline with text

## Color Scheme

### Light Mode
| Token | Value | Usage |
|-------|-------|-------|
| Page Background | `rgb(252, 252, 252)` | #fcfcfc - off-white |
| Text Primary | `rgb(23, 23, 23)` | #171717 - near-black |
| Text Muted | `rgb(111, 111, 111)` | #6f6f6f - labels |
| Stage Background | `rgb(248, 248, 248)` | #f8f8f8 - subtle gray |
| Code Background | Warm cream/beige | ~#f3ede5 |
| Accent Orange | `color(display-p3 .99 .4 .02)` | Vibrant P3 orange |
| Focus Highlight | Peachy/orange tint | Code line highlighting |

### Dark Mode (CSS Variables)
| Token | Value | Usage |
|-------|-------|-------|
| --color-bg | `#0a0a0a` | Page background |
| --color-high-contrast | `#fff` | Primary text |
| --color-demo-bg | `#121212` | Stage/demo area |
| --color-code-tag | `#ffc799` | HTML/JSX tags |
| --color-code-string | `#99ffe4` | String values |
| --color-gray1-12 | 12-step scale | #161616 → #ededed |

## Code Block Focus Highlighting

### Visual Treatment
- **Highlighted lines**: Subtle peachy/orange background tint
- **Left border indicator**: Thin orange/coral vertical line on highlighted section
- **Non-highlighted lines**: Slightly dimmed (reduced opacity)
- **Transition**: Smooth background color transition

### Implementation Pattern
```css
.code-line.highlighted {
  background: rgba(255, 200, 150, 0.15); /* peachy tint */
  border-left: 2px solid var(--accent-orange);
}

.code-line:not(.highlighted) {
  opacity: 0.6;
}
```

## Step Transitions

### Active Step Behavior
- Current step text: Full opacity, darker color
- Previous step text: **Faded** (reduced opacity) - creates visual hierarchy
- Large spacing between step sections (generous whitespace)

### Step Indicator
- Small orange dot appears at start of each step section
- Positioned to the left of the content

## Annotations (Right Panel)

### Arrow Labels
- Hand-drawn style arrows (SVG)
- Labels use **italic** or handwriting-style font
- Labels like "outer ring", "inset rings", "sibling buttons"
- Clean, educational annotation style

## Interactive Elements

### Links
- Subtle styling (not bright blue)
- External link icon beside external URLs
- Hover state: underline or color change

### Demo UI
- Bottom bar with "Next.js Dev Tools" label + "Settings"
- Top-right corner icons: expand, refresh, code view
- Interactive elements within the stage area

## Spacing & Rhythm

### Vertical Rhythm
- **38px** line-height creates consistent baseline grid
- Large gaps between step sections
- Generous padding around code blocks

### Horizontal Spacing
- **48px** padding on left column
- Comfortable reading width (~700px for text)
- Full-bleed for overall container

## Key Differences from Our Current Implementation

| Aspect | Devouring Details | Our Current |
|--------|-------------------|-------------|
| Paragraph Size | 20px | 16px (text-swiss-body) |
| Line Height | 38px (1.9) | ~27px (1.7) |
| Font Weight | 500 (medium) | 400 (normal) |
| Column Split | 50/50 | 45/55 |
| Code Line Height | 38px | Default |
| Focus Highlight | Peachy tint + left border | bg-muted + left border |
| Step Fade | Previous steps fade | Active indicator only |

## Recommendations for ScrollyCoding

1. **Increase typography size**: Bump paragraph to 18-20px with 36-38px line-height
2. **Use medium font weight (500)** for better readability
3. **Match code line-height** to paragraph line-height for visual rhythm
4. **Warm focus highlighting**: Change from gray to peachy/orange tint
5. **Add step fading**: Fade previous step content as user scrolls
6. **Consider 50/50 split**: May feel more balanced than 45/55
7. **Generous whitespace**: Increase spacing between steps
