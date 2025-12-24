import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import { PageViewTracker } from "./components/PageViewTracker";
import { AuthProvider } from "./context/AuthContext";
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
      <head>
        {/* Facebook SDK */}
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0"
        />
      </head>
      <body className="bg-white text-gray-900">
        <AuthProvider>
          <PageViewTracker />
          <Header />
          <main className="pt-20 pb-20">{children}</main>
          <Footer />
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
