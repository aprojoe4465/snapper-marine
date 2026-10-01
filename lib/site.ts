export const site = {
  name: "Snapper Marine, LLC",
  shortName: "Snapper Marine",
  tagline: "Mobile Marine Service — We Come to You",
  domain: "snappermarine.com",
  phone: "9549344474",
  phoneDisplay: "(954) 934-4474",
  phoneHref: "tel:+19549344474",
  email: "info@snappermarine.com", // placeholder — update when ready
  serviceAreas: [
    { name: "Coral Springs", note: "Primary area" },
    { name: "Port St. Lucie", note: "Primary area" },
    { name: "South Florida", note: "Broader coverage — exact radius TBD" },
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
