import HomeClient from "./HomeClient";
import { fetchLandingData } from "../lib/fetchLandingData";

export default async function Page() {
  const data = await fetchLandingData();
  return <HomeClient {...data} />;
}
