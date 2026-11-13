export interface SeasonalPromo {
  title: string;
  subtitle: string;
  badge: string;
}

/**
 * Monthly promotional copy — the storefront offer updates automatically
 * with the current month (no manual edits needed).
 */
const MONTHLY_PROMOS: SeasonalPromo[] = [
  {
    title: "New Year Sale — up to 50% off",
    subtitle: "Start the year in style with our biggest winter markdowns.",
    badge: "NEW YEAR",
  },
  {
    title: "Winter Clearance — up to 50% off",
    subtitle: "Last chance on cosy layers before spring arrives.",
    badge: "CLEARANCE",
  },
  {
    title: "Spring Refresh — up to 50% off",
    subtitle: "Lighter layers and fresh colours for the new season.",
    badge: "FRESH",
  },
  {
    title: "Spring Sale — up to 50% off",
    subtitle: "Bloom into the season with fresh styles and soft prices.",
    badge: "SPRING",
  },
  {
    title: "Spring Sale — up to 50% off",
    subtitle: "Warmer days are here — save on breezy everyday looks.",
    badge: "SPRING",
  },
  {
    title: "Summer Sale — up to 50% off",
    subtitle: "Sun-ready styles at our hottest prices of the year.",
    badge: "SUMMER",
  },
  {
    title: "Mid-Summer Sale — up to 50% off",
    subtitle: "Hot days, cool deals — save on summer favourites.",
    badge: "SUMMER",
  },
  {
    title: "Back to School — up to 50% off",
    subtitle: "Campus-ready fits at prices that make the grade.",
    badge: "BTS",
  },
  {
    title: "Autumn Edit — up to 50% off",
    subtitle: "Layer up with cosy knits, jackets and boots on offer.",
    badge: "AUTUMN",
  },
  {
    title: "Fall Collection Sale — up to 50% off",
    subtitle: "Sweater-weather savings on this season's cosy staples.",
    badge: "FALL",
  },
  {
    title: "November Sale — up to 50% off",
    subtitle: "Early holiday deals on the styles everyone wants.",
    badge: "HOT",
  },
  {
    title: "Holiday Sale — up to 50% off",
    subtitle: "Festive savings to make gifting (and keeping) easy.",
    badge: "HOLIDAY",
  },
];

export function getSeasonalPromo(date: Date = new Date()): SeasonalPromo {
  return MONTHLY_PROMOS[date.getMonth()];
}
