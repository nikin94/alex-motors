import { FaChevronDown } from 'react-icons/fa6'

/* The bouncing "next screen" anchor every screen but the last carries.
   Desktop-only (hidden below md): mobile scrolls freely with no snap, so the
   affordance would just repeat what a thumb already knows. */
export function ScrollChevron({
  href,
  label,
  className,
}: {
  href: string
  label: string
  className?: string
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={`absolute bottom-5 hidden p-2 transition-colors hover:text-amber-100 md:block ${
        className ?? 'text-amber-100/40'
      }`}
    >
      <FaChevronDown className="size-5 motion-safe:animate-bounce" />
    </a>
  )
}
