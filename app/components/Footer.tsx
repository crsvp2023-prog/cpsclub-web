export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[var(--color-dark)] to-[rgba(1,44,90,0.95)] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* About section */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-[var(--color-accent)]">CPS Club</h3>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Chatswood Premier Sports Club - your home for cricket excellence and community spirit.
            </p>
          </div>

          {/* Contact section */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-[var(--color-accent)]">Contact Us</h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/80">
              <p className="flex items-center gap-2">
                <span className="text-[var(--color-accent)] font-semibold text-lg flex-shrink-0">📍</span>
                <span className="break-words">Freeman Road, Chatswood</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[var(--color-accent)] font-semibold text-lg flex-shrink-0">📞</span>
                <a href="tel:0432635434" className="hover:text-[var(--color-accent)] transition-colors">
                  0432 635 434
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[var(--color-accent)] font-semibold text-lg flex-shrink-0">✉️</span>
                <a href="mailto:crsvp.2023@gmail.com" className="hover:text-[var(--color-accent)] transition-colors break-all">
                  info@cpsclub.com.au
                </a>
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-[var(--color-accent)]">Quick Links</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs sm:text-sm text-white/80">
              <li>
                <a href="/" className="hover:text-[var(--color-accent)] transition-colors">Home</a>
              </li>
              <li>
                <a href="/about" className="hover:text-[var(--color-accent)] transition-colors">About Us</a>
              </li>
              <li>
                <a href="/events" className="hover:text-[var(--color-accent)] transition-colors">Events</a>
              </li>
              <li>
                <a href="/register" className="hover:text-[var(--color-accent)] transition-colors">Register</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Cricket Australia Support */}
        <div className="mb-8 sm:mb-12 text-center py-6 sm:py-8">
          <p className="text-xs sm:text-sm font-semibold text-[var(--color-accent)] mb-4 uppercase tracking-wide">Proudly supported by</p>
          <div className="flex justify-center">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/3/3f/Cricket_Australia.png" 
              alt="Cricket Australia" 
              className="h-10 sm:h-14 md:h-16 w-auto max-w-xs hover:opacity-80 transition-opacity"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-6" />

        {/* Copyright */}
        <div className="text-center text-xs sm:text-sm text-white/70">
          <p>Copyright © {new Date().getFullYear()} CHATSWOOD PREMIER SPORTS CLUB</p>
          <p className="mt-2 text-white/50">All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
