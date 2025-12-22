import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

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

      <Footer />
    </main>
  );
}
