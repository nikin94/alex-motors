/* A neon two-post car lift, drawn as line art in the same amber-on-dark
   language as the sign — a mechanic-shop hero unique to this site, sitting
   beside the services grid on the second screen. Deliberately self-contained
   and decorative (aria-hidden): the whole concept can be removed by deleting
   this component and its one <ServicesLift /> usage, with no other change.
   The car is a simple side profile so its detail level matches the sign. */
export function ServicesLift() {
  return (
    <svg
      viewBox="0 0 320 430"
      className="services-lift h-auto w-full max-w-[15rem] sm:max-w-md"
      aria-hidden
      fill="none"
      stroke="#ffb347"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Floor feet */}
      <path d="M46 402h48M226 402h48" />
      {/* Two posts */}
      <path d="M70 402V44M250 402V44" />
      {/* Top cross-beam */}
      <path d="M70 44h180" />
      {/* Control panel on the left post */}
      <rect x="52" y="150" width="26" height="46" rx="5" strokeWidth="4" />
      <circle cx="65" cy="164" r="2.5" fill="#ffb347" stroke="none" />
      <circle cx="65" cy="182" r="2.5" fill="#ffb347" stroke="none" />
      {/* Lift carriages + arms reaching under the car */}
      <path d="M70 250h54M250 250h-54" />
      <rect x="63" y="240" width="14" height="22" rx="3" strokeWidth="4" />
      <rect x="243" y="240" width="14" height="22" rx="3" strokeWidth="4" />

      {/* Car in side profile, raised on the arms */}
      {/* Lower body */}
      <path d="M104 238v-14q0-9 12-11l22-1 12-19h40l14 19 12 1q11 2 11 12v13" />
      {/* Beltline / underside */}
      <path d="M104 238h116" strokeWidth="5" />
      {/* Greenhouse (windscreen + roof + rear glass) */}
      <path d="M150 193l12-15h36l12 15" strokeWidth="4" />
      {/* Door seam */}
      <path d="M172 178v34" strokeWidth="3" />
      {/* Wheels */}
      <circle cx="132" cy="244" r="17" strokeWidth="5" />
      <circle cx="132" cy="244" r="6" strokeWidth="4" />
      <circle cx="196" cy="244" r="17" strokeWidth="5" />
      <circle cx="196" cy="244" r="6" strokeWidth="4" />
    </svg>
  )
}
