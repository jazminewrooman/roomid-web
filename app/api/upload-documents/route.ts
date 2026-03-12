import { NextResponse } from "next/server";
import { createUploadJob } from "@/lib/roomid-demo";

export async function POST(request: Request) {
  const formData = await request.formData();

  const contract = formData.get("contract");
  const payments = formData.get("payments");
  const reference = formData.get("reference");

  if (!(contract instanceof File) || !(payments instanceof File)) {
    return NextResponse.json(
      { error: "contract and payments files are required" },
      { status: 400 },
    );
  }

  const job = createUploadJob({
    contractFileName: contract.name,
    paymentsFileName: payments.name,
    referenceFileName: reference instanceof File ? reference.name : undefined,
  });

  return NextResponse.json({
    message: "Upload received",
    jobId: job.jobId,
    userId: job.userId,
    status: "queued",
  });
}
