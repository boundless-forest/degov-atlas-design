# Governance Feed UI Refinement Guide

## Audience and product posture

The page serves governance participants who scan quickly for urgency, active votes, ended-vote outcomes, and DAO activity. It should feel like a refined governance-intelligence board, not a schema viewer, analytics builder, or marketing hero.

The content contract from the current canonical design remains unchanged. This iteration changes visual hierarchy, density, and interaction presentation only.

## Design principles

1. **Compact page identity, not a hero.**
   - `Live governance feed` is a single uninterrupted line.
   - Use a restrained display size (`clamp(28px, 2.5vw, 52px)`), tight tracking, and a compact 104–132px header region.
   - Keep the existing supported-surface description, but limit it to one concise line on desktop.
   - The eyebrow/status tags should read as quiet metadata, not a second navigation bar.

2. **Design communicates type without explanatory headers.**
   - Remove `EVENT TYPE`, `STATE / ACTION`, `DAO / TITLE`, `WHEN`, and similar schema labels from Priority Signals and the main feed.
   - Signal type remains visible in each row as a compact fixed-width mono token.
   - State/outcome remains at the trailing edge as the semantic status treatment.
   - Do not add helper copy explaining that these are different dimensions; the row rhythm should make this self-evident.

3. **Priority Signals becomes an attention strip.**
   - One concise section label and three dense signal rows.
   - Remove the ranking-method subtitle and column-header row.
   - Each row follows: urgency marker → signal type → DAO/title → action/state.
   - Use a narrow left accent or square marker for urgency; no card-within-card styling.
   - Target row height: 34–38px.

4. **Filters are a quiet toolbar, not a gray segmented block.**
   - Remove the separate `ACTIVITY TYPE` and `SIGNALS · 14D` headings.
   - Merge the total/window readout and filter controls into one compact toolbar immediately above the feed.
   - Use lightweight text tabs with counts in muted tabular numerals; no full-width gray background strip and no large bordered rectangles.
   - Active state: bright text plus a 1px bottom rule or restrained white inset surface; inactive states remain transparent.
   - Preserve direct `signal_types` filtering and keyboard focus behavior.
   - Allow horizontal overflow scrolling on narrow viewports instead of stacking into tall filter buttons.

5. **The feed is the dominant visual surface.**
   - Target row height: 42–46px desktop.
   - Use thin separators, consistent tabular time width, compact signal token width, flexible DAO/title, and a right-aligned outcome.
   - DAO name uses restrained green; proposal title remains the primary white scanning target.
   - Avoid table headers when alignment and repetition already communicate structure.

6. **Right rail is concise and aligned.**
   - Keep the accepted components: `LIVE NOW`, `VOTE OUTCOMES · 14D`, `MOST ACTIVE · 14D SIGNALS`.
   - Use a 292–312px rail, one consistent surface level, 10–12px panel padding, and compact 30–34px metric rows.
   - Reduce card borders and nested boxes; use shared dividers and aligned tabular numerals.
   - The first rail panel aligns with the top of Priority Signals.

7. **One visual system.**
   - Preserve Atlas xAI foundations: near-black surfaces, square corners, thin low-opacity borders, Geist/monospace identity, no gradients, no shadows, no decorative rounded pills.
   - Borrow Linear’s precision only for density: subtle luminance steps, quiet borders, tightly tuned typography, and compact toolbars.
   - Semantic colors remain functional only: green active/passed, amber urgency/no quorum, red defeated, neutral unavailable/discussion.

## Layout contract

### Wide desktop

- Page header: compact full-width band, one-line title.
- Body: `minmax(0, 1fr) 300px` main/rail grid with 12px gap.
- Main column: Priority Signals → unified filter toolbar → feed rows.
- Rail: three compact stacked panels.
- The first full viewport should show the header, all Priority Signals, the filter toolbar, and multiple feed rows without the oversized dead zone visible in the rejected version.

### Desktop/tablet

- Title stays on one line by scaling down rather than wrapping.
- Priority row title may ellipsize after the DAO prefix; state/action stays visible.
- Filter toolbar scrolls horizontally if needed.
- Rail stacks below the feed only when the two-column layout no longer supports readable titles.

### Phone

- Title remains one line at approximately 28px.
- Priority Signals stay compact; title truncation is acceptable with full text available via the row/link.
- Filter toolbar is a single horizontally scrollable row, never a vertical stack of full-width buttons.
- Feed row reflows to two lines while keeping signal type and outcome visible.
- Summary panels stack after the feed/priority area with fixed-footer clearance.

## Interaction rules

- Filter buttons retain `aria-pressed` and filter the existing `data-signal-group` rows.
- Active filter is visible without relying on color alone.
- Hover/focus uses border/text luminance changes, not motion-heavy effects.
- Rows remain keyboard-navigable if links are present.
- No new information tooltip or explanatory panel is introduced.

## Content rules retained

- Keep event type separate from state/outcome semantically, but not through public schema headers.
- Keep `NO QUORUM` separate from `DEFEATED`.
- Keep unsupported `Execution` and `Treasury` absent.
- Keep the accepted Live Now, 14-day outcome, and 14-day DAO activity content.
- Do not reintroduce sample/staging methodology copy.

## Negative contract

The final public artifact must not contain:

- A wrapped desktop `Live governance feed` title.
- `EVENT TYPE`, `STATE / ACTION`, `DAO / TITLE`, `WHEN`, or `ACTIVITY TYPE` as visible explanatory headers.
- A full-width gray filter background strip.
- Vertically stacked full-width filter buttons on phone.
- A Priority Signals ranking-method subtitle.
- Unsupported `Execution`, `Treasury`, or generic `Failed` copy.
