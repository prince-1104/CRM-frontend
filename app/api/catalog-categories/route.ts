import { NextResponse } from "next/server";

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  try {
    const response = await fetch(`${apiUrl}/api/public/catalog-categories`, {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }
    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data : [], { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
