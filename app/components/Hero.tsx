export default function Hero() {
  return (
    <>
    <section className="bg-gradient-to-br from-[var(--color-dark)] via-[rgba(1,44,90,0.9)] to-[var(--color-primary)] relative overflow-hidden">
      {/* Accent circle background element */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--color-primary-2)] rounded-full opacity-10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[var(--color-accent)] rounded-full opacity-5 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-6 py-40 grid md:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <div className="inline-block mb-4 px-4 py-2 bg-[var(--color-accent)]/20 rounded-full border border-[var(--color-accent)]/50">
            <p className="text-sm font-semibold text-[var(--color-accent)]">Welcome to Excellence</p>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            CPS Cricket Club
          </h1>
          
          <p className="mt-6 text-lg text-white/90 max-w-2xl leading-relaxed">
            Founded in 2016 and officially incorporated in 2023, we are the heart of cricket in Chatswood. Driven by our motto, <span className="text-[var(--color-accent)] font-semibold">"One Team, One Dream,"</span> we bridge the gap between competitive sport and community spirit.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <a
              href="/register"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--color-primary-2)] to-[var(--color-accent)] text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-200 text-lg font-semibold focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Register Now
            </a>
            <a href="#about" className="text-base text-white/80 hover:text-[var(--color-accent)] transition-colors">
              ↓ Learn more about us
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md md:max-w-none rounded-2xl overflow-hidden shadow-2xl ring-4 ring-[var(--color-accent)]/30 transform hover:scale-105 transition-transform duration-300">
            <picture>
              <source media="(min-width:1200px)" srcSet="/images/hero-photo.jpg" />
              <source media="(min-width:640px)" srcSet="/images/hero-photo.jpg" />
              <img
                src="/images/hero-illustration.svg"
                alt="Team playing cricket"
                className="w-full h-auto object-cover"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>

    {/* Floating sticky CTA: visible across pages while on this section */}
    <a
      href="/register"
      aria-label="Register Now"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 bg-gradient-to-r from-[var(--color-primary-2)] to-[var(--color-accent)] text-white px-5 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform duration-200 focus:outline-none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zm2 1H6a4 4 0 00-4 4v1a1 1 0 001 1h10a1 1 0 001-1v-1a4 4 0 00-4-4zM15 8a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1V9a1 1 0 011-1z" />
      </svg>
      <span className="font-semibold">Register</span>
    </a>
    </>
  );
}
