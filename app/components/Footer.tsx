export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[var(--color-dark)] to-[rgba(1,44,90,0.95)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* About section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[var(--color-accent)]">CPS Club</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Chatswood Premier Sports Club - your home for cricket excellence and community spirit.
            </p>
          </div>

          {/* Contact section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[var(--color-accent)]">Contact Us</h3>
            <div className="space-y-3 text-sm text-white/80">
              <p className="flex items-center gap-2">
                <span className="text-[var(--color-accent)] font-semibold">📍</span>
                Freeman Road, Chatswood
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[var(--color-accent)] font-semibold">📞</span>
                <a href="tel:0432635434" className="hover:text-[var(--color-accent)] transition-colors">
                  0432 635 434
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[var(--color-accent)] font-semibold">✉️</span>
                <a href="mailto:info@cpsclub.com.au" className="hover:text-[var(--color-accent)] transition-colors">
                  info@cpsclub.com.au
                </a>
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[var(--color-accent)]">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/80">
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

        {/* Divider */}
        <div className="h-px bg-white/10 mb-6" />

        {/* Copyright */}
        <div className="text-center text-sm text-white/70">
          <p>Copyright © {new Date().getFullYear()} CHATSWOOD PREMIER SPORTS CLUB</p>
          <p className="mt-2 text-white/50">All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
