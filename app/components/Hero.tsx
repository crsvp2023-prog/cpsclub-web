'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <>
    <section className="bg-gradient-to-br from-[var(--color-dark)] via-[#00215d] to-[var(--color-primary)] relative overflow-hidden">
      {/* Animated accent circles background */}
      <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-[var(--color-accent)] rounded-full opacity-10 blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-[var(--color-primary-2)] rounded-full opacity-8 blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-40 sm:w-60 h-40 sm:h-60 bg-[var(--color-accent)] rounded-full opacity-5 blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center relative z-10">
        <div className="md:col-span-1 order-2 md:order-1">
          <div className="inline-block mb-3 sm:mb-4 px-3 py-1 bg-[var(--color-accent)]/15 rounded-full border border-[var(--color-accent)]/40">
            <p className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-widest">🏏 Welcome to Chatswood Premier Sports Club</p>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
            Chatswood<br className="hidden sm:block" />Premier Sports Club
          </h1>
          
          <p className="mt-3 text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed font-normal" style={{ fontFamily: 'Arial, sans-serif' }}>
            Founded in 2016 and officially incorporated in 2023, we are the heart of cricket in Chatswood. Driven by our motto, <span className="text-[var(--color-accent)] font-bold">"One Team, One Dream,"</span> we bridge the gap between competitive sport and community spirit.
          </p>

          <div className="mt-5 sm:mt-6 flex flex-col gap-3 sm:gap-4">
            <a
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-dark)] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200 text-sm sm:text-base font-black focus:outline-none border-2 border-white/30 relative overflow-hidden group w-full sm:w-auto"
              style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.05em' }}
            >
              {/* Animated background shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-full group-hover:translate-x-0"></div>
              
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span className="relative z-10">Register Now</span>
            </a>
            <a href="#about" className="text-sm text-white/80 hover:text-[var(--color-accent)] transition-colors font-medium text-center sm:text-left" style={{ fontFamily: 'Arial, sans-serif' }}>
              ↓ Learn more about us
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 md:col-span-1 order-1 md:order-2 w-full max-w-sm sm:max-w-none mx-auto sm:mx-0">
          {/* Main Hero Image */}
          <div className="relative w-full overflow-hidden rounded-lg sm:rounded-2xl">
            {/* Glow effect behind image */}
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-lg sm:rounded-2xl opacity-20 blur-lg sm:blur-xl -z-10"></div>
            
            {/* Main image container */}
            <div className="relative rounded-lg sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl ring-2 ring-[var(--color-accent)]/30 transform hover:scale-105 transition-transform duration-500 bg-gradient-to-br from-[var(--color-primary-2)] to-[var(--color-primary)]">
              <img
                src="/images/hero-illustration.svg"
                alt="CPS Club Cricket Team"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Trophies Image */}
          <div className="relative w-full overflow-hidden rounded-lg sm:rounded-2xl">
            {/* Glow effect behind image */}
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-lg sm:rounded-2xl opacity-20 blur-lg sm:blur-xl -z-10"></div>
            
            {/* Trophies image container */}
            <div className="relative rounded-lg sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl ring-2 ring-[var(--color-accent)]/30 transform hover:scale-105 transition-transform duration-500 bg-white">
              <Image
                src="/images/trophies.jpg"
                alt="CPS Club Trophies"
                width={300}
                height={300}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-16 sm:w-24 h-16 sm:h-24 bg-[var(--color-accent)] rounded-full opacity-10 blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-20 sm:w-32 h-20 sm:h-32 bg-[var(--color-primary-2)] rounded-full opacity-8 blur-2xl"></div>
        </div>
      </div>
    </section>
    </>
  );
}
