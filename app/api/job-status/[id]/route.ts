import { NextResponse } from "next/server";
import { readJobStatus } from "@/lib/roomid-demo";

export async function GET(
  _request: Request,
  context: { params: { id: string } },
) {
  const status = readJobStatus(context.params.id);

  if (!status) {
    return NextResponse.json({ error: "job not found" }, { status: 404 });
  }

  return NextResponse.json(status);
}
