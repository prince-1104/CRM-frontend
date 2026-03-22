import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  phone?: string;
};

type BackendErrorBody = {
  detail?: string;
  status?: string;
};

function mapBackendMessage(detail: string | undefined): string {
  if (!detail) return "Something went wrong. Please try again.";
  const lower = detail.toLowerCase();
  if (lower.includes("phone") || lower.includes("invalid phone")) {
    return detail.includes("Invalid") ? detail : "Invalid phone format";
  }
  return detail;
}

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
    let response: Response;
    try {
      response = await fetch(`${apiUrl}/api/public/submit-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: body.name,
          phone: body.phone,
        }),
      });
    } catch {
      return NextResponse.json(
        { success: false, error: "Network error" },
        { status: 503 },
      );
    }

    if (!response.ok) {
      let errJson: BackendErrorBody = {};
      try {
        errJson = (await response.json()) as BackendErrorBody;
      } catch {
        errJson = {};
      }
      const detail = typeof errJson.detail === "string" ? errJson.detail : undefined;
      const message = mapBackendMessage(detail);
      const status = response.status >= 400 && response.status < 500 ? response.status : 502;
      return NextResponse.json({ success: false, error: message }, { status });
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
