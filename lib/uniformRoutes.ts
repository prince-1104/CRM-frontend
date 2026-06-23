export type UniformRouteConfig = {
  slug: string;
  /** Canonical catalog category used to filter products */
  category: string;
  title: string;
  headline: string;
  description: string;
  metaDescription: string;
  linkText: string;
  linkDescription1: string;
  linkDescription2: string;
};

export const UNIFORM_CATEGORY_ROUTES = {
  "catering-uniforms": {
    slug: "catering-uniforms",
    category: "Catering",
    title: "Catering Uniforms",
    headline: "Catering uniforms built for events & service",
    description:
      "Durable staff wear for caterers — chef coats, aprons, and event teams. Browse styles and request a bulk quote.",
    metaDescription:
      "Durable catering uniforms for events and hospitality staff. Shop chef coats, aprons, and team kits from Star Uniform.",
    linkText: "Catering Uniforms",
    linkDescription1: "Durable staff wear for caterers",
    linkDescription2: "Shop styles & sizes now",
  },
  "hotel-uniforms": {
    slug: "hotel-uniforms",
    category: "Hotels",
    title: "Hotel Uniforms",
    headline: "Hotel uniforms from front desk to housekeeping",
    description:
      "Stylish uniforms for hotel staff — reception, concierge, and housekeeping kits tailored to your property.",
    metaDescription:
      "Premium hotel uniforms for front desk, concierge, and housekeeping teams across India.",
    linkText: "Hotel Uniforms",
    linkDescription1: "Stylish uniforms for hotel staff",
    linkDescription2: "Front desk to housekeeping",
  },
  "restaurant-uniforms": {
    slug: "restaurant-uniforms",
    category: "Restaurants",
    title: "Restaurant Uniforms",
    headline: "Restaurant uniforms for busy kitchens & dining rooms",
    description:
      "Chef coats, aprons, and server wear built for busy kitchens — consistent branding for your floor team.",
    metaDescription:
      "Chef coats, aprons, and server uniforms for restaurants. Built for busy kitchens and fine dining.",
    linkText: "Restaurant Uniforms",
    linkDescription1: "Chef coats, aprons & server wear",
    linkDescription2: "Built for busy kitchens",
  },
  "bar-uniforms": {
    slug: "bar-uniforms",
    category: "Catering",
    title: "Bar Uniforms",
    headline: "Bar uniforms with sharp, all-shift comfort",
    description:
      "Sharp looks for bartenders and bar staff — breathable fabrics and consistent fits for long shifts.",
    metaDescription:
      "Professional bar and bartender uniforms. Comfortable all-shift wear with custom branding.",
    linkText: "Bar Uniforms",
    linkDescription1: "Sharp looks for bartenders",
    linkDescription2: "Comfortable all-shift wear",
  },
} as const satisfies Record<string, UniformRouteConfig>;

export type UniformRouteSlug = keyof typeof UNIFORM_CATEGORY_ROUTES;

export function getUniformRoute(slug: string): UniformRouteConfig | null {
  return UNIFORM_CATEGORY_ROUTES[slug as UniformRouteSlug] ?? null;
}

/** Map a catalog category label to its public uniforms URL slug */
export function slugForCategoryName(name: string): UniformRouteSlug | null {
  const lower = name.trim().toLowerCase();
  if (!lower) return null;
  if (lower.includes("hotel") || lower === "hk" || lower.includes("housekeep"))
    return "hotel-uniforms";
  if (lower.includes("restaurant")) return "restaurant-uniforms";
  if (lower.includes("bar")) return "bar-uniforms";
  if (lower.includes("cater") || lower.includes("chef")) return "catering-uniforms";
  return null;
}

/** Match API/product category names to the route's canonical category */
export function productMatchesCategory(
  productCategory: string | null | undefined,
  routeCategory: string,
): boolean {
  const p = (productCategory || "").trim().toLowerCase();
  const r = routeCategory.trim().toLowerCase();
  if (!p) return false;
  if (p === r) return true;
  if (r === "hotels" && (p === "hotel" || p.includes("hotel"))) return true;
  if (r === "restaurants" && (p === "restaurant" || p.includes("restaurant")))
    return true;
  if (r === "catering" && (p.includes("cater") || p.includes("chef") || p.includes("bar")))
    return true;
  return false;
}
