/* The tile chrome (border, background, selected/idle colours) shared by the
   Button tile variant and composite tiles — the mobile FAQ wraps a question
   row plus a collapsible answer in one tile that must look exactly like a
   Button tile in both states. Split from Button.tsx so that file only
   exports a component and react-refresh stays happy. */

export const tileState = (active: boolean) =>
  active
    ? 'border-amber-300/60 bg-amber-400/10 text-amber-50'
    : 'border-amber-100/15 bg-black/40 text-amber-50/70 hover:border-amber-100/40 hover:text-amber-50'

export const tileShell = (active: boolean) =>
  `rounded-lg border transition-colors ${tileState(active)}`
