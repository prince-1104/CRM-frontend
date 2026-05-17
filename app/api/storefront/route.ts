import { getPublicApiBaseUrl } from "@/lib/apiBaseUrl";
import { NextResponse } from "next/server";

export const revalidate = 60;

const emptyStorefront = {
  business_name: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
};

export async function GET() {
  const apiUrl = getPublicApiBaseUrl();

  try {
    const response = await fetch(`${apiUrl}/api/public/storefront`, {
      method: "GET",
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return NextResponse.json(emptyStorefront, { status: 200 });
    }
    const data = await response.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json(emptyStorefront, { status: 200 });
  }
}
