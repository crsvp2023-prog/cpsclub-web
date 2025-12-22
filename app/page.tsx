export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">CPS Club</h1>
          <nav className="space-x-6 text-sm font-medium">
            <a href="#about" className="hover:text-blue-600">About</a>
            <a href="#events" className="hover:text-blue-600">Events</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Welcome to CPS Cricket Club
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Building talent, teamwork, and community through the spirit of cricket.
          </p>
        </div>
      </section>

      {/* About */}
      <section id="about">
        <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold">About CPS Club</h3>
            <p className="mt-4 text-gray-600">
              CPS Cricket Club is a community-driven club focused on developing
              players of all ages while promoting sportsmanship and teamwork.
            </p>
          </div>
          <div className="rounded-xl bg-gray-100 h-64 flex items-center justify-center text-gray-500">
            Club Image Placeholder
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-500 flex justify-between">
          <span>© {new Date().getFullYear()} CPS Cricket Club</span>
          <span>Sydney, Australia</span>
        </div>
      </footer>
    </main>
  );
}
