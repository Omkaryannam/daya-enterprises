import Logo from "./Logo";
import PhoneLink from "./PhoneLink";
import { business, emailHrefWithMessage, nav } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-forest py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 md:flex-row md:items-start md:justify-between lg:px-10">
        <div>
          <Logo heightClass="h-10" variant="white" />
          <p className="mt-4 max-w-xs text-sm text-white/75">{business.addressLine}</p>
          <p className="mt-1 text-sm text-white/75">Established {business.established}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-white/80 transition-colors hover:text-sky-soft">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="text-sm text-white/80">
          <PhoneLink className="block transition-colors hover:text-sky-soft">
            {business.phone}
          </PhoneLink>
          <a href={emailHrefWithMessage} className="mt-1 block transition-colors hover:text-sky-soft">
            {business.email}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/15 px-6 pt-6 text-xs text-white/60 lg:px-10">
        &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
      </div>
    </footer>
  );
}
