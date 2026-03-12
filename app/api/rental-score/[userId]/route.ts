import { NextResponse } from "next/server";
import { readRentalScore } from "@/lib/roomid-demo";

export async function GET(
  _request: Request,
  context: { params: { userId: string } },
) {
  const credential = readRentalScore(context.params.userId);

  if (!credential) {
    return NextResponse.json({ error: "rental score not found" }, { status: 404 });
  }

  return NextResponse.json(credential);
}
