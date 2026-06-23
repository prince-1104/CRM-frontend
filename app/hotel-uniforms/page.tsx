import { uniformRouteMetadata, UniformCategoryPage } from "../../lib/UniformCategoryPage";

export const metadata = uniformRouteMetadata("hotel-uniforms");

export default function Page() {
  return <UniformCategoryPage slug="hotel-uniforms" />;
}
