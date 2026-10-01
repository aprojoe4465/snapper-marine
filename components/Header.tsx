"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, site } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Image
            src="/logo-header.png"
            alt="Snapper Marine logo"
            width={248}
            height={56}
            priority
          />
          <span className="sr-only">{site.shortName}</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>

        <nav className={`nav${open ? " open" : ""}`} aria-label="Main">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "active" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <a href={site.phoneHref} className="phone-pill nav-cta">
            Call {site.phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}
