export default function Header() {
  return (
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
  );
}
