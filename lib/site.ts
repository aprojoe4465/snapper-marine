export const site = {
  name: "Snapper Marine, LLC",
  shortName: "Snapper Marine",
  tagline: "Mobile Marine Service — We Come to You",
  domain: "snappermarine.com",
  phone: "7726268149",
  phoneDisplay: "(772) 626-8149",
  phoneHref: "tel:+17726268149",
  email: "mbarnes@snappermarine.com",
  serviceAreaSummary: "Broward, Palm Beach, Martin, and St. Lucie counties (Florida)",
  serviceAreas: [
    { name: "Broward County", note: "Florida service area" },
    { name: "Palm Beach County", note: "Florida service area" },
    { name: "Martin County", note: "Florida service area" },
    { name: "St. Lucie County", note: "Florida service area" },
  ],
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/mobile-marine", label: "Mobile Marine" },
  { href: "/service-area", label: "Service Area" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/book", label: "Book Service" },
] as const;
