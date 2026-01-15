import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import { PageViewTracker } from "./components/PageViewTracker";
import { AuthProvider } from "./context/AuthContext";
import { Inter, Montserrat } from "next/font/google";
import SocialEmbedScripts from "./components/SocialEmbedScripts";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata = {
  title: "Chatswood Premier Sports Club",
  description: "Chatswood Premier Sports Club - One Team, One Dream",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} font-inter bg-white text-gray-900`}>
        <AuthProvider>
          <PageViewTracker />
          <Header />
          <main className="pt-16 md:pt-20 pb-12 md:pb-20">{children}</main>
          <Footer />
          <Chatbot />
        </AuthProvider>
        <SocialEmbedScripts />
      </body>
    </html>
  );
}
