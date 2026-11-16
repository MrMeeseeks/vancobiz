/**
 * All site copy and numbers live here so they can be confirmed in one place.
 *
 * Anything marked `illustrative: true` is sample content written to show the layout.
 * Replace it with real client results (with permission) or delete it before launch.
 */

export const CONTACT = {
  // TODO(confirm): real business inbox. Do not use a personal address.
  email: "hello@vancobiz.com",
  city: "Vancouver, BC",
  hours: "Mon–Fri · 9am–6pm PT",
  // Optional: set NEXT_PUBLIC_FORM_ENDPOINT (e.g. a Formspree URL) to receive form posts.
  // Without it, the booking form opens a pre-filled email instead.
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",
};

export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#case-studies", label: "Case Studies" },
  { href: "#club", label: "VancoBiz Club" },
  { href: "#results", label: "Results" },
];

// TODO(confirm): these are the figures from the brief. Verify each one is real and current.
export const STATS = [
  { value: 4.8, decimals: 1, suffix: "x", label: "Average client ROAS" },
  { value: 15, decimals: 0, suffix: "M+", label: "Local & viral video views" },
  { value: 120, decimals: 0, suffix: "+", label: "Vancouver brands scaled" },
  { value: 50, decimals: 0, suffix: "+", label: "VancoBiz Club events hosted" },
];

export type ServiceKey = "video" | "ads" | "brand" | "events";

export const SERVICES: {
  key: ServiceKey;
  title: string;
  blurb: string;
  deliverables: string[];
  accent: string;
}[] = [
  {
    key: "video",
    title: "Viral Content & Videography",
    blurb: "Short-form video built for the feed, shot and cut in Vancouver.",
    deliverables: [
      "Reels, TikTok & Shorts production",
      "Creator-style UGC shoots",
      "Monthly content calendars",
      "Editing, captions & hooks",
    ],
    accent: "#00F0FF",
  },
  {
    key: "ads",
    title: "Paid Ads & Performance Marketing",
    blurb: "Meta, Google and TikTok campaigns managed against real revenue.",
    deliverables: [
      "Funnel & offer strategy",
      "Creative testing at scale",
      "Pixel, CAPI & GA4 tracking",
      "Weekly ROAS reporting",
    ],
    accent: "#7000FF",
  },
  {
    key: "brand",
    title: "Brand Identity & 3D Web Design",
    blurb: "Identities and sites that look nothing like your competitors.",
    deliverables: [
      "Logo, type & colour systems",
      "Interactive 3D websites",
      "Landing pages that convert",
      "Brand guidelines",
    ],
    accent: "#FFB800",
  },
  {
    key: "events",
    title: "Influencer & Event Activations",
    blurb: "Real-world moments that turn into content and customers.",
    deliverables: [
      "Local creator partnerships",
      "Launch parties & pop-ups",
      "On-site content capture",
      "Community seeding",
    ],
    accent: "#00F0FF",
  },
];

export const CASE_STUDIES: {
  id: string;
  sector: string;
  title: string;
  summary: string;
  metrics: { value: string; label: string }[];
  gradient: string;
  illustrative: boolean;
}[] = [
  {
    id: "hospitality",
    sector: "Local hospitality",
    title: "Café launch in Mount Pleasant",
    summary:
      "Pre-opening creator dinner, a two-week Reels rollout and geo-targeted ads to fill the first month.",
    metrics: [
      { value: "—", label: "Opening-week covers" },
      { value: "—", label: "Reel views" },
    ],
    gradient: "from-[#00F0FF]/40 via-[#7000FF]/20 to-transparent",
    illustrative: true,
  },
  {
    id: "ecommerce",
    sector: "eCommerce",
    title: "DTC brand scale-up",
    summary:
      "Weekly UGC creative tests feeding Meta and TikTok campaigns, with tracking rebuilt end to end.",
    metrics: [
      { value: "—", label: "ROAS" },
      { value: "—", label: "Monthly revenue growth" },
    ],
    gradient: "from-[#7000FF]/45 via-[#00F0FF]/15 to-transparent",
    illustrative: true,
  },
  {
    id: "real-estate",
    sector: "Real estate",
    title: "Luxury pre-sale campaign",
    summary:
      "Cinematic property film, a 3D listing microsite and a private broker evening.",
    metrics: [
      { value: "—", label: "Qualified leads" },
      { value: "—", label: "Event RSVPs" },
    ],
    gradient: "from-[#FFB800]/40 via-[#7000FF]/15 to-transparent",
    illustrative: true,
  },
];

export const CLUB = {
  tagline: "Vancouver's founder network that actually meets in person.",
  perks: [
    { title: "Networking mixers", text: "Monthly evenings with founders, creators and operators." },
    { title: "Founder workshops", text: "Hands-on sessions on ads, content and growth." },
    { title: "Member perks", text: "Priority shoot dates and partner discounts." },
  ],
};

export const REVENUE_OPTIONS = [
  "Under $10k / month",
  "$10k – $50k / month",
  "$50k – $250k / month",
  "$250k+ / month",
  "Pre-launch",
];
