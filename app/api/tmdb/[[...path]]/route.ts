import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
// Prefer specific API_KEY if available, else fall back to public one for transition period
const API_KEY =
  process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const searchParams = request.nextUrl.searchParams;

  // Construct the target URL
  const targetPath = path ? path.join("/") : "";
  const url = new URL(`${TMDB_BASE_URL}/${targetPath}`);

  // Add query parameters
  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  // Add default language if not provided
  if (!url.searchParams.has("language")) {
    url.searchParams.set("language", "en-US");
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("TMDB Proxy Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
