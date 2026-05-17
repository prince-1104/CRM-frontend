import { getPublicApiBaseUrl } from "@/lib/apiBaseUrl";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  const apiUrl = getPublicApiBaseUrl();

  try {
    const response = await fetch(`${apiUrl}/api/public/catalog-categories`, {
      method: "GET",
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }
    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data : [], {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
