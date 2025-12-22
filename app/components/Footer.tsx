export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-500 flex justify-between">
        <span>© {new Date().getFullYear()} CPS Cricket Club</span>
        <span>Sydney, Australia</span>
      </div>
    </footer>
  );
}
