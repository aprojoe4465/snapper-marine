/** Illustrative center-console fishing boat imagery (free-license stock).
 *  Not official Contender product photos; not an endorsement of any boat brand.
 *  Credits kept here for license provenance (not shown on the site):
 *  - center-console-offshore.jpg — AH360Photography · CC BY 2.0
 *  - center-console-beach.jpg — CenturyBoat · CC BY-SA 4.0 via Wikimedia Commons
 *  - center-console-helm.jpg — Paréj Richárd · Unsplash License
 *  - center-console-running.jpg — Pixabay Content License
 *  - center-console-harbor.jpg — L'eau Bleue · CC BY-SA 2.0
 *  - outboard-detail.jpg — Autohitch · CC BY 2.0
 */
export type BoatImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const boatHero: BoatImage = {
  src: "/boats/center-console-offshore.jpg",
  alt: "Dark metallic center-console sport fishing boat underway with outboards",
  width: 1024,
  height: 756,
};

export const boatGallery: BoatImage[] = [
  {
    src: "/boats/center-console-beach.jpg",
    alt: "White center-console fishing boat with twin outboards at a sandy shoreline",
    width: 1800,
    height: 1200,
  },
  {
    src: "/boats/center-console-helm.jpg",
    alt: "Chrome steering wheel and gauges at a center-console helm",
    width: 1600,
    height: 1067,
  },
  {
    src: "/boats/center-console-running.jpg",
    alt: "White center-console boat running across deep blue water leaving a wake",
    width: 1280,
    height: 773,
  },
  {
    src: "/boats/center-console-harbor.jpg",
    alt: "Small center-console boat speeding across a dark harbor under overcast skies",
    width: 1024,
    height: 683,
  },
];

export const boatServices: BoatImage = {
  src: "/boats/outboard-detail.jpg",
  alt: "High-performance outboard motors on a center-console fishing boat",
  width: 1024,
  height: 684,
};
