import { NextResponse } from "next/server";

export function GET() {
  return new NextResponse("google-site-verification: googleb1c6ceb34c7e4704.html", {
    headers: { "Content-Type": "text/html" },
  });
}
