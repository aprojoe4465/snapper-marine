/** Illustrative center-console fishing boat imagery (free-license stock).
 *  Not official Contender product photos; not an endorsement of any boat brand.
 */
export type BoatImage = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  width: number;
  height: number;
};

export const boatHero: BoatImage = {
  src: "/boats/center-console-offshore.jpg",
  alt: "Dark metallic center-console sport fishing boat underway with outboards",
  caption:
    "Center-console fishing boat style reference — illustrative stock photo, not a Contender product image.",
  credit: "Photo: AH360Photography · CC BY 2.0",
  width: 1024,
  height: 756,
};

export const boatGallery: BoatImage[] = [
  {
    src: "/boats/center-console-beach.jpg",
    alt: "White center-console fishing boat with twin outboards at a sandy shoreline",
    caption: "Center-console fishing boat — style reference (illustrative).",
    credit: "Photo: CenturyBoat · CC BY-SA 4.0 via Wikimedia Commons",
    width: 1800,
    height: 1200,
  },
  {
    src: "/boats/center-console-helm.jpg",
    alt: "Chrome steering wheel and gauges at a center-console helm",
    caption: "Center-console helm detail — style reference (illustrative).",
    credit: "Photo: Paréj Richárd · Unsplash License",
    width: 1600,
    height: 1067,
  },
  {
    src: "/boats/center-console-running.jpg",
    alt: "White center-console boat running across deep blue water leaving a wake",
    caption: "Center-console fishing boat underway — style reference (illustrative).",
    credit: "Pixabay Content License",
    width: 1280,
    height: 773,
  },
  {
    src: "/boats/center-console-harbor.jpg",
    alt: "Small center-console boat speeding across a dark harbor under overcast skies",
    caption: "Center-console fishing boat on open water — style reference (illustrative).",
    credit: "Photo: L'eau Bleue · CC BY-SA 2.0",
    width: 1024,
    height: 683,
  },
];

export const boatServices: BoatImage = {
  src: "/boats/outboard-detail.jpg",
  alt: "High-performance outboard motors on a center-console fishing boat",
  caption:
    "Outboard power common on center-console fishing boats — illustrative stock photo.",
  credit: "Photo: Autohitch · CC BY 2.0",
  width: 1024,
  height: 684,
};
