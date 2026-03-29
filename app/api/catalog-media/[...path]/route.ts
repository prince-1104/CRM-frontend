import { getPublicApiBaseUrl } from "@/lib/apiBaseUrl";
import { NextResponse } from "next/server";

type RouteCtx = { params: { path: string[] } };

/**
 * Proxies catalog images from the FastAPI backend (R2 credentials stay server-side).
 * Avoids 401 from r2.dev when the bucket is not publicly readable.
 */
export async function GET(_request: Request, ctx: RouteCtx) {
  const segments = ctx.params.path;
  if (!segments?.length) {
    return new NextResponse(null, { status: 404 });
  }

  const apiUrl = getPublicApiBaseUrl();
  const subpath = segments.map(encodeURIComponent).join("/");

  try {
    const response = await fetch(
      `${apiUrl}/api/public/catalog/media/${subpath}`,
      { method: "GET", cache: "no-store" },
    );

    if (!response.ok) {
      return new NextResponse(null, { status: response.status });
    }

    const headers = new Headers();
    const ct = response.headers.get("content-type");
    if (ct) headers.set("content-type", ct);
    headers.set("cache-control", "public, max-age=600");

    return new NextResponse(response.body, { status: 200, headers });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
