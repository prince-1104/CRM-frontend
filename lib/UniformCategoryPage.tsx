import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UniformCategoryPageClient from "../app/components/UniformCategoryPageClient";
import { fetchLandingData } from "./fetchLandingData";
import {
  getUniformRoute,
  type UniformRouteSlug,
  UNIFORM_CATEGORY_ROUTES,
} from "./uniformRoutes";

export function uniformRouteMetadata(slug: UniformRouteSlug): Metadata {
  const config = UNIFORM_CATEGORY_ROUTES[slug];
  return {
    title: `${config.title} | Star Uniform`,
    description: config.metaDescription,
    alternates: { canonical: `/${slug}` },
  };
}

type Props = {
  slug: UniformRouteSlug;
};

export async function UniformCategoryPage({ slug }: Props) {
  const config = getUniformRoute(slug);
  if (!config) notFound();
  const data = await fetchLandingData();
  return <UniformCategoryPageClient {...data} config={config} />;
}
