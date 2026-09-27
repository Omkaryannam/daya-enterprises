"use client";

import { business } from "@/lib/content";

function isLikelyMobileDevice() {
  if (typeof navigator === "undefined") return false;
  const uaHasMobileMarker = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(
    navigator.userAgent
  );
  const isCoarsePointer =
    typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;
  return uaHasMobileMarker || isCoarsePointer;
}

/**
 * A phone-number link that behaves like a real dialer on mobile (tel: opens
 * the native call screen with the number ready to dial) and, since laptops
 * and desktops generally have no dialer app to hand off to, opens the
 * WhatsApp chat with the same number instead.
 */
export default function PhoneLink({
  children,
  className,
  "data-cursor": dataCursor,
}: {
  children: React.ReactNode;
  className?: string;
  "data-cursor"?: string;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLikelyMobileDevice()) {
      e.preventDefault();
      window.open(business.whatsappHref, "_blank", "noopener,noreferrer");
    }
    // On mobile, do nothing extra — let the tel: href open the dialer as normal.
  };

  return (
    <a href={business.phoneHref} onClick={handleClick} className={className} data-cursor={dataCursor}>
      {children}
    </a>
  );
}
