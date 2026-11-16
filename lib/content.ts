/**
 * All site copy and numbers live here. Everything below is taken from vancobiz.com
 * (home, /social-media, /photography) as of Nov 16, 2026 unless marked TODO.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => `${BASE}${p}`;

export const CONTACT = {
  email: "info@vancobiz.com",
  phone: "(604) 773-7736",
  phoneHref: "tel:+16047737736",
  address: "1919 Lonsdale Ave, North Vancouver",
  city: "North Vancouver, BC",
  clubUrl: "https://club.vancobiz.com/members/",
  // Optional: set NEXT_PUBLIC_FORM_ENDPOINT (e.g. a Formspree URL) to receive form posts.
  // Without it, the booking form opens a pre-filled email instead.
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",
};

export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#team", label: "Team" },
  { href: "#pricing", label: "Pricing" },
  { href: "#club", label: "VancoBiz Club" },
];

// From the "Our Impact in Numbers" counters on vancobiz.com.
export const STATS = [
  { value: 70, decimals: 0, suffix: "+", label: "Leads generated" },
  { value: 250, decimals: 0, suffix: "%", label: "Traffic growth" },
  { value: 3, decimals: 0, suffix: "x", label: "ROI" },
];

export type ServiceKey = "social" | "video" | "photo" | "events";

export const SERVICES: {
  key: ServiceKey;
  title: string;
  blurb: string;
  deliverables: string[];
  accent: "a1" | "a2" | "a3";
}[] = [
  {
    key: "social",
    title: "Social Media Marketing",
    blurb: "Consistent content, strategic ads and real engagement on Instagram and Facebook.",
    deliverables: [
      "Content creation & scheduling",
      "Meta ad campaign management",
      "Monthly analytics & optimisation",
      "Strategy & planning sessions",
    ],
    accent: "a1",
  },
  {
    key: "video",
    title: "Videography & Reels",
    blurb: "Scroll-stopping short-form video, produced for the feed.",
    deliverables: [
      "Pro Reels production",
      "Instagram Stories",
      "Ad creative design",
      "Collab posts with creators",
    ],
    accent: "a2",
  },
  {
    key: "photo",
    title: "Photography",
    blurb: "Visuals that speak louder than words, from menus to launch nights.",
    deliverables: [
      "Product photography",
      "Restaurant & food photography",
      "Event photography",
      "eCommerce & catalogue shots",
    ],
    accent: "a3",
  },
  {
    key: "events",
    title: "Influencer & Event Activations",
    blurb: "Real-world experiences that turn into content and customers.",
    deliverables: [
      "Influencer marketing campaigns",
      "Taster Party brand showcases",
      "VancoBiz Club networking",
      "On-site content capture",
    ],
    accent: "a1",
  },
];

// The kinds of work shown on vancobiz.com. No invented results: add real numbers here when you have them.
export const WORK: {
  id: string;
  sector: string;
  title: string;
  summary: string;
  tags: string[];
  gradient: string;
}[] = [
  {
    id: "taster-party",
    sector: "Event activation",
    title: "Taster Party",
    summary:
      "A flavour-filled social experience: craft cocktails, wine flights and chef-inspired bites from handpicked vendors, in a vibrant, intimate setting.",
    tags: ["Events", "Vendors", "Community"],
    gradient: "from-accent/40 via-glow/20 to-transparent",
  },
  {
    id: "restaurant",
    sector: "Restaurant & food",
    title: "Menus that sell",
    summary:
      "Irresistible visuals for menus, delivery platforms and social campaigns, highlighting texture, colour and atmosphere.",
    tags: ["Photography", "Food", "Social"],
    gradient: "from-glow/45 via-accent/15 to-transparent",
  },
  {
    id: "product",
    sector: "Product & jewellery",
    title: "Products that shine",
    summary:
      "Clean, high-resolution product and jewellery shots for eCommerce, catalogues and promotional campaigns.",
    tags: ["Photography", "eCommerce"],
    gradient: "from-highlight/40 via-glow/15 to-transparent",
  },
  {
    id: "reels",
    sector: "Social media",
    title: "Reels that stop the scroll",
    summary:
      "Visuals, videos and captions in your brand voice, scheduled for peak performance and tuned every month.",
    tags: ["Reels", "Stories", "Meta Ads"],
    gradient: "from-accent/35 via-highlight/15 to-transparent",
  },
];

export const CLUB = {
  tagline: "Connect, collaborate, grow locally. Vancouver's business community that actually meets in person.",
  perks: [
    { title: "Connect", text: "Meet local founders, creators and business owners." },
    { title: "Collaborate", text: "Find partners, cross-promote and create together." },
    { title: "Grow locally", text: "Show your brand at Taster Party and community events." },
  ],
};

// TODO(confirm): roles for Arshia and Dorsa aren't listed on vancobiz.com.
export const TEAM = [
  { name: "Amin", role: "Founder & CEO", photo: "/team/amin.png" },
  { name: "Pedram", role: "Social Media Manager", photo: "/team/pedram.png" },
  { name: "Pegah", role: "Photographer", photo: "/team/pegah.png" },
  { name: "Arshia", role: "Creative Team", photo: "/team/arshia.png" },
  { name: "Dorsa", role: "Creative Team", photo: "/team/dorsa.png" },
];

// From vancobiz.com/social-media. TODO(confirm): billing period and currency aren't stated there.
export const PACKAGES = [
  {
    name: "Soldier",
    price: "$2,157",
    features: ["1 hour strategy & planning", "5 pro Reels", "4 Instagram Stories", "2 professional photos"],
    featured: false,
  },
  {
    name: "King",
    price: "$3,477",
    features: [
      "2 hours strategy & planning",
      "8 pro Reels",
      "8 Instagram Stories",
      "1 ad design",
      "1 collab post with a creator",
      "4 professional photos",
    ],
    featured: true,
  },
  {
    name: "Queen",
    price: "$5,997",
    features: [
      "3 hours strategy & planning",
      "14 pro Reels",
      "12 Instagram Stories",
      "2 ad designs",
      "2 collab posts with creators",
      "6 professional photos",
    ],
    featured: false,
  },
];

export const CONTRACT_DISCOUNTS = [
  { term: "3 months", off: "5%" },
  { term: "6 months", off: "12%" },
  { term: "12 months", off: "25%" },
];

export const REVENUE_OPTIONS = [
  "Under $10k / month",
  "$10k – $50k / month",
  "$50k – $250k / month",
  "$250k+ / month",
  "Pre-launch",
];
