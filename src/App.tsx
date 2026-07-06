function App() {
  return (
    <main>
      <section className="brick-wall relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
        <div className="lamp-glow flicker pointer-events-none absolute inset-0" />
        <div className="vignette pointer-events-none absolute inset-0" />

        <div className="flicker relative text-center">
          <h1 className="neon-sign font-display text-7xl tracking-[0.12em] sm:text-9xl">
            Alex Motors
          </h1>
          <p className="font-display text-xl tracking-[0.45em] text-amber-100/60 sm:text-2xl">
            Auto Repair &amp; Service
          </p>
        </div>

        {/* TODO: replace with the real phone number */}
        <a
          href="tel:+353000000000"
          className="font-display absolute bottom-14 text-2xl tracking-[0.2em] text-amber-50/80 transition-colors hover:text-amber-50"
        >
          +353 00 000 0000
        </a>
      </section>

      {/* Coming next: services, address + map, opening hours, social links */}
    </main>
  )
}

export default App
