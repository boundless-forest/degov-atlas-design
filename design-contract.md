# Design Contract — DeGov Atlas Redesign

## Goal

Redesign the DeGov Atlas public DAO governance platform, currently a DeFiLlama-inspired Next.js dashboard. The target artifact is a refreshed Next.js App Router UI that preserves the data-dense, information-forward character while elevating visual craft.

## Evidence

| Source | What was observed | Confidence |
|--------|-------------------|------------|
| `globals.css` (1369 lines) | Full CSS token set: colors, typography, spacing, grid layouts, component styles, states | observed |
| `layout.tsx` | Left sidebar shell, brand mark, 4-item nav, newsletter section, subscribe form, mobile tab bar | observed |
| `page.tsx` (homepage) | Dashboard layout: search topbar → market strip → overview grid → content grids × 2 | observed |
| `ui.tsx` | Reusable components: StatePill, MetricCard, DaoCard, ProposalCard, VoteDistribution, EvidenceList, EmptyState, ErrorState, LoadingSkeleton, PageIntro, FilterForm, GlossaryTerm, CaveatBox | observed |
| AGENTS.md | Project architecture: backend → Atlas is the public-facing Next.js app, data sourced from backend API | observed |
| Recent commits | Newsletter archive redesign (#114), reduced bold fonts (#112), proposal vote data (#111) — active iteration on design | observed |

## Keep / Change / Do Not Copy

| Keep | Change | Do Not Copy |
|------|--------|-------------|
| Data density and 8px grid | Typography: explore expressive type pairings beyond Inter-only | DeFiLlama's exact color palette or brand marks |
| Left sidebar navigation model | Color palette: consider a more distinctive accent than pure #111 | Any specific exchange/crypto platform's layout |
| Bordered card aesthetic | Component hierarchy: refine heading scale and visual weight | Figma or design tool exports — work from code |
| Semantic state colors (green/amber/red) | Motion: add purposeful transitions for state changes | |
| Loading/empty/error states for every view | Mobile: improve tab bar visual design | |
| Sidebar width (244px) and sticky behavior | Brand mark: consider evolution beyond single-letter "D" | |
| Vote distribution bar charts | Card internal spacing: 14px padding is tight, evaluate readability | |
| Non-expert-friendly language | | |

## Final Design Stance

Keep the DeFiLlama-inspired data-dense dashboard character — white backgrounds, tight grids, compact cards, left sidebar navigation. Evolve the visual language with more deliberate typography (consider a distinctive display face for headlines), a subtly warmer or more intentional accent color, refined card hierarchy through type scale rather than decoration, and purposeful micro-interactions on state changes. Never sacrifice information density for visual flair.

## Risks & Unknowns

- **Risk:** Changing accent color from #111 may clash with existing dark-button patterns used across 11+ pages
- **Risk:** Introducing a new display font may shift layout metrics and require re-testing responsive breakpoints
- **Unknown:** User's appetite for dark mode — current design is light-only
- **Unknown:** Whether newsletter archive redesign (#114) represents the desired design direction or is still experimental

## Quality Gate

- [ ] DESIGN.md passes `npx @google/design.md lint` with zero errors
- [ ] All current component variants (StatePill, DaoCard, ProposalCard, VoteDistribution, etc.) are represented
- [ ] Color contrast meets WCAG AA (4.5:1 for body text, 3:1 for large text)
- [ ] Responsive behavior verified at mobile (<768px) and desktop widths
- [ ] Loading, empty, error states preserved for every data-dependent view
- [ ] No loss of information density compared to current design
