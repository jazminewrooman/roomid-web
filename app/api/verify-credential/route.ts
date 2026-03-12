import { NextResponse } from "next/server";
import { RentalCredential, verifyCredential } from "@/lib/roomid-demo";

export async function POST(request: Request) {
  const payload = (await request.json()) as { credential?: RentalCredential };

  if (!payload?.credential) {
    return NextResponse.json({ error: "credential is required" }, { status: 400 });
  }

  const verification = verifyCredential(payload.credential);

  return NextResponse.json({
    valid: verification.valid,
    message: verification.valid
      ? "Credential verified: signature and score integrity checks passed"
      : "Credential verification failed",
    reasons: verification.reasons,
    checks: verification.checks,
  });
}
