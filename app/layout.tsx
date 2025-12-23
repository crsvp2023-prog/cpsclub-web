import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import "./globals.css";

export const metadata = {
  title: "CPS Club",
  description: "CPS Cricket Club website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <Header />
        <main className="pt-20 pb-20">{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
