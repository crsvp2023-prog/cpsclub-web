"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function SocialEmbedScripts() {
  const pathname = usePathname();

  // Avoid third-party embeds on authenticated/admin areas.
  // These SDKs can emit noisy console errors (e.g. Permissions Policy: unload)
  // and have been observed interfering with navigation.
  const isRestrictedRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  if (isRestrictedRoute) return null;

  return (
    <>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <Script src="https://www.instagram.com/embed.js" strategy="afterInteractive" />
    </>
  );
}
