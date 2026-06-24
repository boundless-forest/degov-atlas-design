---
version: alpha
name: DeGov Atlas
description: Data-dense DeFiLlama-inspired governance dashboard. Clean white backgrounds, near-black ink, compact card layouts, Inter typography.
colors:
  primary: "#0b0b0b"
  secondary: "#5f6368"
  tertiary: "#2563eb"
  accent: "#111111"
  neutral: "#ffffff"
typography:
  h1:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.075em"
  h2:
    fontFamily: Inter
    fontSize: 1.3rem
    fontWeight: 600
  body:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
  eyebrow:
    fontFamily: Inter
    fontSize: 0.76rem
    fontWeight: 600
    letterSpacing: 0.04em
rounded:
  sm: 4px
  md: 8px
  lg: 12px
spacing:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 14px
  xl: 24px
  xxl: 32px
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: 5px 12px
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
  button-secondary:
    backgroundColor: "#ffffff"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 5px 12px
---

# Design System — DeGov Atlas

> Category: Data-Dense Governance Dashboard
> Light-themed DeFiLlama-inspired design for the DeGov Atlas public DAO governance platform.

## Overview

Data-dense, DeFiLlama-inspired governance dashboard. Clean white backgrounds, near-black ink, subtle gray separators, and compact card-based layouts. No gradients, no glass effects, no decorative flourishes. The interface prioritizes information density and scanability for repeated use by governance analysts and non-expert DAO participants.

- **Visual style:** DeFiLlama-inspired data dashboard, light theme, bordered white cards, compact typography, minimal chrome
- **Color stance:** white surface + near-black ink + functional status colors (green/amber/red), with dark accent for interactive elements
- **Design intent:** Keep pages scannable and dense enough for repeated analytical use while remaining approachable for non-expert users

## Colors

- **Primary (#0b0b0b):** Primary text, headings, dark buttons, brand mark fill. Near-black for strong contrast on white.
- **Accent (#111111):** Interactive element backgrounds — dark buttons, hover states, active nav items, pills. Slightly lighter than primary for visual distinction.
- **Secondary (#5f6368):** Muted labels, eyebrow text, sidebar descriptions.
- **Tertiary (#2563eb):** Link color and interactive accents — used sparingly for hyperlinks and data-highlight elements.
- **Neutral (#ffffff):** Main content area and card backgrounds.

Additional functional colors (not in token frontmatter — documented here for agent reference):
- **Green (#058d42):** Active, passed, executed, fresh states. Background tint: rgba(5, 141, 66, 0.08).
- **Red (#d92d20):** Failed, canceled, stale, degraded states. Background tint: rgba(217, 45, 32, 0.08).
- **Amber (#9a6700):** Partial, ending-soon, queued, not-normalized states. Background tint: rgba(154, 103, 0, 0.08).
- **Purple (#8b35d9):** Reserved for special categorization or future feature states.
- **Line (#dedede):** Card borders, separators, input borders.
- **Soft (#f5f5f5):** Subtle background differentiation, neutral pill backgrounds.
- **Sidebar (#f6f6f6):** Left navigation background, visually separated by a gradient blend.

## Typography

Inter is the sole typeface, used across all text roles. System sans-serif stack as fallback: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI".

- **h1 (Display):** 3rem (desktop), weight 700, line-height 0.94, letter-spacing -0.075em — for page heroes and main headlines. Use responsive clamp(2.1rem, 5vw, 4.3rem) in CSS for fluid scaling.
- **h2 (Section):** 1.3rem, weight 600 — for card and section headings
- **body:** 1rem (16px), weight 400, line-height 1.55 — for descriptions, summaries, and long-form content
- **eyebrow:** 0.76rem, weight 600, letter-spacing 0.04em — for category labels above headings

Headings carry compressed line-height and tight letter-spacing for a data-terminal feel. Body text stays readable at 1.55 line-height for long-form DAO descriptions and proposal summaries.

## Layout

- **Spacing scale:** 8px baseline grid (4, 6, 8, 10, 12, 14, 16, 24, 32px)
- **Card gap:** 8px between all cards and grid items
- **Card padding:** 14px internal padding on all cards and panels
- **Layout grid:** CSS Grid with named templates — `overview-grid` (0.52fr / 1fr), `content-grid.two-col` (1fr / 1fr), `content-grid.three-col` (1fr / 1fr / 1fr)
- **Sidebar:** 244px fixed width, sticky, full viewport height
- Keep vertical rhythm consistent. Cards stack in 8px gaps; sections use the same 8px gap between panels.

## Shapes

- **Border radius:** 7px for buttons and pill components, 8px for cards, panels, inputs. 12px for brand mark.
- **Borders:** 1px solid #dedede on every card, panel, input, and interactive surface
- No shadows, no gradients — flat bordered aesthetic throughout

## Components

### Buttons
- `button-primary`: dark background (#111111), white text, 7px radius, 5px 12px padding, 30px min-height, weight 550
- `button-secondary`: white background, dark text, 7px radius, 5px 12px padding, 30px min-height, 1px solid #dedede border
- `button-small`: 26px min-height, 3px 8px padding, 0.84rem font-size
- `button-ghost`: transparent background, no border

### Pills & Badges
- `chain-pill`: 24px min-height, soft gray bg (#f4f4f4), turns dark on hover, 7px radius
- `state-pill`: 22px min-height, 7px radius, bold text (weight 600, 0.78rem). Uses tinted backgrounds at 8% opacity with matching text color: green on rgba(5,141,66,0.08), amber on rgba(154,103,0,0.08), red on rgba(217,45,32,0.08)
- `tag` / `chip`: dark background (#111), white text, or neutral variant with soft background

### Cards
- `.card` / `.panel` / `.metric-card`: 1px border, 8px radius, white bg, 14px padding
- `.hero-market-card`: flex column, min-height 400px, space-between distribution
- `.dao-card`: card with eyebrow, title link, tags row, mini-metrics grid, muted footer
- `.proposal-card`: card with eyebrow (daoName · source), title, plain summary, insight panel, mini-metrics
- `.item-card.dense`: compact stacked card with strong title, subtitle, small detail line

### Data Display
- `.data-table`: Role-based table with head row and linked data rows
- `.vote-stack`: Vertical bar chart for vote distribution with percentage bars and colored fills
- `.activity-chart`: CSS-only vertical bar chart from importance scores
- `.ticker-list`: Horizontal definition list for metrics with trend indicators
- `.mini-metrics`: 3-column definition list for card footers

### States
- `EmptyState`: Centered card with title, detail, role="status"
- `LoadingSkeleton`: Variants for card, text, metric, table-row with pulse animation
- `ErrorState`: Alert card with title, detail, optional retry button
- `CaveatBox`: Aside with title and list of coverage caveat notes

### Navigation
- **Sidebar nav:** Grid of links, 32px min-height, 7px radius, first item + hover get dark bg
- **Mobile tab bar:** Fixed bottom bar with icon + label, mirrors primary nav with shortened labels
- **Market strip:** Horizontal scroll of DAO pills with strip label

## Do's and Don'ts

- **Do** maintain 8px grid spacing and 14px card padding across all new components
- **Do** use semantic state colors (green/amber/red) for status indicators — never invent new status colors
- **Do** provide LoadingSkeleton, EmptyState, and ErrorState for every data-dependent view
- **Do** keep the left sidebar at 244px and preserve the mobile tab bar
- **Don't** introduce gradients, glass effects, or decorative shadows — the aesthetic is flat and bordered
- **Don't** reduce data density below the current 8px card gap / 14px padding standard
- **Don't** add marketing-style hero sections or large illustrations — this is a dashboard, not a landing page
- **Don't** remove state indicators from any data-dependent view
- **Don't** flatten typography hierarchy — headings must remain visually distinct from body text
