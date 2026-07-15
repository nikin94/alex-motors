import type { ComponentPropsWithRef } from 'react'

/* Shared button styling for the site's two recurring shapes:
   - `cta`: the amber pill (Get Directions, the form's Send)
   - `tile`: a service tab tile, with `active` switching the selected look
   Renders an <a> when `href` is set, a <button> otherwise (type defaults to
   "button" so a stray form button never submits). Cursor: pointer comes from
   the global button rule in index.css — Tailwind v4 resets it to default. */

type StyleProps = { variant?: 'cta' | 'tile'; active?: boolean }

type Props = StyleProps &
  (
    | ({ href: string } & ComponentPropsWithRef<'a'>)
    | ({ href?: undefined } & ComponentPropsWithRef<'button'>)
  )

const CTA =
  'font-display inline-flex items-center justify-center gap-2 rounded-md border border-amber-300/40 bg-amber-400/10 px-5 py-3 text-lg tracking-[0.12em] text-amber-100 transition-colors hover:border-amber-300/70 hover:bg-amber-400/20 hover:text-amber-50 disabled:pointer-events-none disabled:opacity-60'

const TILE =
  'rounded-lg border px-4 py-3 text-left font-display text-base tracking-[0.06em] transition-colors sm:text-lg'

const tileState = (active: boolean) =>
  active
    ? 'border-amber-300/60 bg-amber-400/10 text-amber-50'
    : 'border-amber-100/15 bg-black/40 text-amber-50/70 hover:border-amber-100/40 hover:text-amber-50'

export function Button(props: Props) {
  const { variant = 'cta', active = false, className, ...rest } = props
  const base = variant === 'cta' ? CTA : `${TILE} ${tileState(active)}`
  const classes = className ? `${base} ${className}` : base
  if (rest.href !== undefined) {
    return <a {...(rest as ComponentPropsWithRef<'a'>)} className={classes} />
  }
  const { type = 'button', ...button } = rest as ComponentPropsWithRef<'button'>
  return <button type={type} {...button} className={classes} />
}
