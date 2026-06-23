import { uniformRouteMetadata, UniformCategoryPage } from "../../lib/UniformCategoryPage";

export const metadata = uniformRouteMetadata("restaurant-uniforms");

export default function Page() {
  return <UniformCategoryPage slug="restaurant-uniforms" />;
}
