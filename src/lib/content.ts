// Single source of truth for Daya Enterprises content.
// Only facts explicitly provided by the client are used here.
// No invented client names, project counts, certifications, or statistics.

export const business = {
  name: "Daya Enterprises",
  established: 2021,
  phone: "9921919293",
  phoneHref: "tel:+919921919293",
  whatsappHref:
    "https://wa.me/919921919293?text=" +
    encodeURIComponent("Hi Daya Enterprises, I'd like to know more about your services."),
  email: "daya.enterprises2021@gmail.com",
  emailHref: "mailto:daya.enterprises2021@gmail.com",
  addressLine1: "113/114, New Nana Peth, Nawa Wada,",
  addressLine2: "Near Balaji Mandir, Pune, Maharashtra 411002",
  city: "Pune",
  pin: "411002",
  state: "Maharashtra",
  country: "India",
  addressLine: "113/114, New Nana Peth, Nawa Wada, Near Balaji Mandir, Pune, Maharashtra 411002",
  mapCoords: "18.513548569012062,73.86679407718873",
};

/**
 * A mailto: link with a friendly subject/body already filled in, so clicking
 * it opens the person's email app with a message ready to send — used
 * anywhere the email address itself is the call-to-action (footer, header
 * CTA, contact info block). Kept separate from `business.emailHref` because
 * the contact form's fallback-to-email flow builds its own subject/body onto
 * `emailHref` and appending two query strings would break the mailto link.
 */
export const emailHrefWithMessage =
  business.emailHref +
  "?subject=" +
  encodeURIComponent("Enquiry — Daya Enterprises Website") +
  "&body=" +
  encodeURIComponent("Hi Daya Enterprises team,\n\nI'd like to know more about your services.\n\n");

export const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  headline: "ENGINEERING THE FUTURE OF INFRASTRUCTURE",
  subheadline:
    "LED Displays • Road Safety • Smart Surveillance • Fabrication • Infrastructure Solutions",
  supporting:
    "Daya Enterprises delivers reliable technology and infrastructure solutions across Pune and beyond — from intelligent LED displays and CCTV systems to road safety, signage, fabrication and installation.",
  primaryCta: "Explore Our Services",
  secondaryCta: "Contact Daya Enterprises",
};

export const about = {
  headline: "BUILT ON EXPERIENCE. DRIVEN BY EXECUTION.",
  body:
    "Established in 2021, Daya Enterprises provides integrated technology, infrastructure and engineering solutions for businesses, industries and infrastructure projects.",
  pillars: [
    "Quality execution",
    "Reliable products",
    "Professional installation",
    "AMC Maintenance",
    "Safety",
    "Customer satisfaction",
    "Timely project completion",
  ],
  timeline: [
    { label: "2021", detail: "Foundation of Daya Enterprises" },
    { label: "Projects", detail: "Delivering LED, CCTV & infrastructure work" },
    { label: "Expansion", detail: "Growing service capability across Pune" },
    { label: "Future", detail: "Building smarter infrastructure, together" },
  ],
};

export type ServiceCard = {
  index: string;
  title: string;
  description: string;
  bullets: string[];
  /** Representative project photo for this service (shown in the detail modal). */
  image?: string;
};

export const serviceCards: ServiceCard[] = [
  {
    index: "01",
    title: "LED Display Solutions",
    description:
      "Supply, installation, repair and AMC for indoor & outdoor LED displays and video walls.",
    bullets: ["LED Display Supply", "Installation", "Repair & Maintenance", "AMC"],
    image: "/images/projects/led-display-projects.jpg",
  },
  {
    index: "02",
    title: "CCTV & Surveillance",
    description:
      "Commercial and industrial CCTV installation, supply and maintenance for reliable surveillance.",
    bullets: ["CCTV Installation", "Camera Supply", "Maintenance", "Surveillance Systems"],
    image: "/images/projects/cctv-projects.jpg",
  },
  {
    index: "03",
    title: "Gantry Fabrication",
    description:
      "Structural gantry and sign-structure fabrication engineered for highway environments.",
    bullets: ["Gantry Boards", "Structural Fabrication", "Custom Sign Structures"],
    image: "/images/projects/gantry-overhead-board.jpg",
  },
  {
    index: "04",
    title: "Road Safety",
    description:
      "Delineators, barriers and road furniture engineered to protect drivers and pedestrians.",
    bullets: ["Delineators", "Plastic Road Barriers", "Road Furniture", "Traffic Safety Equipment"],
    image: "/images/projects/sign-boards-reference.jpg",
  },
  {
    index: "05",
    title: "Thermoplastic Road Marking",
    description:
      "Thermoplastic plant and application services for durable, reflective road markings.",
    bullets: ["Lane Marking", "Zebra Crossing", "Highway Marking", "Thermoplastic Plant"],
    image: "/images/projects/thermoplastic-marking.jpg",
  },
  {
    index: "06",
    title: "RPM Installation",
    description:
      "Reflective road stud and raised pavement marker installation for night-time visibility.",
    bullets: ["Road Stud Installation", "Reflective RPMs", "Safety Hardware"],
    image: "/images/projects/rpm-road-studs.jpg",
  },
  {
    index: "07",
    title: "Road Signage",
    description:
      "Highway signage and road sign boards designed and fabricated for clarity and durability.",
    bullets: ["Road Sign Boards", "Highway Signage", "Traffic Signage"],
    image: "/images/projects/road-cantilever-signage.jpg",
  },
  {
    index: "08",
    title: "Structural Fabrication",
    description:
      "Mild steel and industrial fabrication built for demanding infrastructure applications.",
    bullets: ["Mild Steel Fabrication", "Industrial Fabrication", "On-site Execution"],
    image: "/images/projects/gantry-overhead-board.jpg",
  },
  {
    index: "09",
    title: "Digital Signage",
    description:
      "Digital signage solutions that combine LED technology with content for outdoor and indoor use.",
    bullets: ["Outdoor LED Solutions", "Indoor LED Solutions", "Digital Signage"],
  },
];

export const whyChooseUs = [
  { label: "Established 2021", detail: "Building infrastructure capability since founding" },
  { label: "Professional Installation", detail: "On-site execution by a dedicated team" },
  { label: "Reliable Maintenance", detail: "AMC and support for long-term performance" },
  { label: "Quality Products", detail: "Materials and equipment built for real conditions" },
  { label: "Safety-Focused Execution", detail: "Safety embedded into every installation" },
  { label: "End-to-End Solutions", detail: "From consultation to support & AMC" },
];

export type ProjectCategory = {
  title: string;
  description: string;
  image?: string;
};

export const projectCategories: ProjectCategory[] = [
  {
    title: "LED Display Projects",
    description: "Indoor & outdoor display installations",
    image: "/images/projects/led-display-projects.jpg",
  },
  {
    title: "CCTV Projects",
    description: "Surveillance systems for commercial sites",
    image: "/images/projects/cctv-projects.jpg",
  },
  {
    title: "Road Safety Projects",
    description: "Barriers, delineators & safety hardware",
    image: "/images/projects/sign-boards-reference.jpg",
  },
  {
    title: "Gantry Projects",
    description: "Highway gantry & structural fabrication",
    image: "/images/projects/gantry-overhead-board.jpg",
  },
  {
    title: "Thermoplastic Marking",
    description: "Lane, crossing & highway markings",
    image: "/images/projects/thermoplastic-marking.jpg",
  },
  {
    title: "RPM Installation",
    description: "Reflective road stud installation",
    image: "/images/projects/rpm-road-studs.jpg",
  },
  {
    title: "Signage Projects",
    description: "Highway & road sign boards",
    image: "/images/projects/road-cantilever-signage.jpg",
  },
];

export const process = [
  { index: "01", title: "Consultation", detail: "Understanding your requirement and site context." },
  { index: "02", title: "Site Survey", detail: "On-ground assessment of infrastructure and conditions." },
  { index: "03", title: "Design & Planning", detail: "Engineering the right solution for the application." },
  { index: "04", title: "Installation / Execution", detail: "Professional on-site installation and fabrication." },
  { index: "05", title: "Support & AMC", detail: "Ongoing maintenance and annual support contracts." },
];

export const industries = [
  "Highways",
  "Infrastructure",
  "Commercial Buildings",
  "Industrial Facilities",
  "Government Projects",
  "Construction",
  "Corporate",
  "Retail",
  "Public Spaces",
];

export type WorkedWithEntry = {
  name: string;
  /**
   * Path to the company's official logo (e.g. "/images/clients/3m.png").
   * Only set this once you have permission to use that company's logo —
   * leave it unset and the clean text badge is shown instead.
   */
  logo?: string;
};

export const workedWith = {
  eyebrow: "WORKED WITH",
  title: "Delivering for established names",
  entries: [
    { name: "3M", logo: "/images/clients/3m.png" },
    { name: "L&T", logo: "/images/clients/lt.png" },
  ] as WorkedWithEntry[],
};

export const featured = {
  led: {
    eyebrow: "LED DISPLAY",
    title: "SMARTER DISPLAYS. STRONGER INFRASTRUCTURE.",
    body: "A realistic roadside LED display, engineered for outdoor visibility and built for continuous operation.",
    useCases: ["Advertising", "Highway information", "Corporate displays", "Outdoor signage", "Digital communication"],
  },
  cctv: {
    eyebrow: "CCTV & SURVEILLANCE",
    title: "SECURITY THAT NEVER LOOKS AWAY.",
    body: "Commercial and industrial CCTV systems supplied, installed and maintained for continuous coverage.",
  },
  gantry: {
    eyebrow: "GANTRY FABRICATION",
    title: "PRECISION FABRICATION. STRONGER INFRASTRUCTURE.",
    body: "Structural gantries fabricated piece by piece and engineered for highway-grade durability.",
  },
  roadSafety: {
    eyebrow: "ROAD SAFETY",
    title: "SAFER ROADS START WITH BETTER INFRASTRUCTURE.",
    body: "Barriers, delineators, sign boards, reflectors, markings and RPMs working together as one safety system.",
  },
  thermoplastic: {
    eyebrow: "THERMOPLASTIC ROAD MARKING",
    title: "MARKINGS BUILT TO LAST.",
    body: "Thermoplastic application for lane lines, zebra crossings, arrows, symbols and highway markings.",
  },
  rpm: {
    eyebrow: "RPM INSTALLATION",
    title: "VISIBILITY, EVEN IN THE DARK.",
    body: "Reflective road studs installed for reliable night-time visibility on highways and roads.",
  },
};

export const cta = {
  headline: "LET'S BUILD SOMETHING SMARTER.",
  body: "Have a project in mind? Talk to Daya Enterprises about LED displays, CCTV, road safety, fabrication, signage and infrastructure solutions.",
};

export const serviceOptions = [
  "LED Display Solutions",
  "CCTV & Surveillance",
  "Gantry Fabrication",
  "Road Safety",
  "Thermoplastic Road Marking",
  "RPM Installation",
  "Road Signage",
  "Structural Fabrication",
  "Digital Signage",
  "Other",
];
