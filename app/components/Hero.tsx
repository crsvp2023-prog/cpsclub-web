export default function Hero() {
  return (
    <>
    <section className="bg-gradient-to-br from-[var(--color-dark)] via-[#00215d] to-[var(--color-primary)] relative overflow-hidden">
      {/* Animated accent circles background */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--color-accent)] rounded-full opacity-10 blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--color-primary-2)] rounded-full opacity-8 blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-[var(--color-accent)] rounded-full opacity-5 blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="mx-auto max-w-7xl px-6 py-40 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <div className="inline-block mb-6 px-4 py-2 bg-[var(--color-accent)]/15 rounded-full border border-[var(--color-accent)]/40">
            <p className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-widest">🏏 Welcome to Excellence</p>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
            CPS<br />Cricket Club
          </h1>
          
          <p className="mt-8 text-lg text-white/90 max-w-2xl leading-relaxed font-normal" style={{ fontFamily: 'Arial, sans-serif' }}>
            Founded in 2016 and officially incorporated in 2023, we are the heart of cricket in Chatswood. Driven by our motto, <span className="text-[var(--color-accent)] font-bold">"One Team, One Dream,"</span> we bridge the gap between competitive sport and community spirit.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
            <a
              href="/register"
              className="inline-flex items-center gap-3 bg-[var(--color-accent)] text-[var(--color-dark)] px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl hover:scale-110 hover:-translate-y-1 transform transition-all duration-200 text-lg font-bold focus:outline-none"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Register Now
            </a>
            <a href="#about" className="text-base text-white/80 hover:text-[var(--color-accent)] transition-colors font-medium" style={{ fontFamily: 'Arial, sans-serif' }}>
              ↓ Learn more about us
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-md md:max-w-none">
            {/* Glow effect behind image */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-2xl opacity-20 blur-xl"></div>
            
            {/* Main image container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-2 ring-[var(--color-accent)]/30 transform hover:scale-105 transition-transform duration-500 bg-gradient-to-br from-[var(--color-primary-2)] to-[var(--color-primary)]">
              <picture>
                <source media="(min-width:1200px)" srcSet="/images/hero-photo.jpg" />
                <source media="(min-width:640px)" srcSet="/images/hero-photo.jpg" />
                <img
                  src="/images/hero-illustration.svg"
                  alt="CPS Club Cricket Team"
                  className="w-full h-auto object-cover brightness-110 contrast-125 hover:brightness-125 transition-all duration-500"
                />
              </picture>
              
              {/* Overlay gradient for realism */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)]/20 to-transparent"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[var(--color-accent)] rounded-full opacity-10 blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[var(--color-primary-2)] rounded-full opacity-8 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
