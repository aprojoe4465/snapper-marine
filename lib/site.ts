export const site = {
  name: "Snapper Marine, LLC",
  shortName: "Snapper Marine",
  tagline: "Mobile Marine Service — We Come to You",
  domain: "snappermarine.com",
  phone: "9549344474",
  phoneDisplay: "(954) 934-4474",
  phoneHref: "tel:+19549344474",
  email: "info@snappermarine.com", // placeholder — update when ready
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
