import { NextResponse } from "next/server";

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  try {
    const response = await fetch(`${apiUrl}/api/public/storefront`, {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json(
        {
          business_name: "",
          phone: "",
          whatsapp: "",
          email: "",
          address: "",
        },
        { status: 200 },
      );
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        business_name: "",
        phone: "",
        whatsapp: "",
        email: "",
        address: "",
      },
      { status: 200 },
    );
  }
}
