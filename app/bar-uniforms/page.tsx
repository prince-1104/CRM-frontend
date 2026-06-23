import { uniformRouteMetadata, UniformCategoryPage } from "../../lib/UniformCategoryPage";

export const metadata = uniformRouteMetadata("bar-uniforms");

export default function Page() {
  return <UniformCategoryPage slug="bar-uniforms" />;
}
