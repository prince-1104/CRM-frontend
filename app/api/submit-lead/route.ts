import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  phone?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, error: "name and phone are required" },
        { status: 400 },
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    const response = await fetch(`${apiUrl}/api/public/submit-lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: body.name,
        phone: body.phone,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to store lead" },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lead received successfully",
        lead: {
          name: body.name,
          phone: body.phone ?? "",
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request payload" },
      { status: 400 },
    );
  }
}
