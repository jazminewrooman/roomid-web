import { createHash, createHmac, randomUUID } from "crypto";
import {
  analyzeRentalHistory,
  PaymentRecord,
  scoreRentalMetrics,
  scoreToTier,
  Tier,
} from "@/lib/scoring";

type UploadFiles = {
  contractFileName: string;
  paymentsFileName: string;
  referenceFileName?: string;
};

type StoredJob = {
  id: string;
  userId: string;
  createdAtMs: number;
  files: UploadFiles;
  credential: RentalCredential;
};

export type RentalCredential = {
  user_id: string;
  rental_score: number;
  tier: Tier;
  months_verified: number;
  on_time_payments: number;
  late_payments: number;
  defaults: number;
  max_delay_days: number;
  hash_of_documents: string;
  timestamp: string;
  proof_mode: "simulated";
  zk_ready: boolean;
  badges: string[];
  signature: string;
};

type CredentialChecks = {
  requiredFields: boolean;
  scoreRangeValid: boolean;
  tierConsistent: boolean;
  timestampValid: boolean;
  hashFormatValid: boolean;
  signatureValid: boolean;
};

export type JobStatus = {
  jobId: string;
  userId: string;
  status: "queued" | "processing" | "completed";
  stepIndex: number;
  progress: number;
};

const SIGNING_SECRET = "roomid-demo-signing-secret";

const PROCESSING_STAGES = [
  { status: "queued" as const, stepIndex: 0, progress: 10, maxElapsed: 1200 },
  { status: "processing" as const, stepIndex: 1, progress: 35, maxElapsed: 2600 },
  { status: "processing" as const, stepIndex: 2, progress: 62, maxElapsed: 4200 },
  { status: "processing" as const, stepIndex: 3, progress: 86, maxElapsed: 6200 },
];

const DEMO_ZK_PROOFS = [
  "🥇 Proof of Income Threshold",
  "🥈 Proof of Rental Affordability Ratio",
  "🥉 Proof of No-Default History",
];

function buildMockPayments(): PaymentRecord[] {
  return [
    { month: "2024-01", dueDate: "2024-01-05", paidOn: "2024-01-04", amount: 8000 },
    { month: "2024-02", dueDate: "2024-02-05", paidOn: "2024-02-05", amount: 8000 },
    { month: "2024-03", dueDate: "2024-03-05", paidOn: "2024-03-04", amount: 8000 },
    { month: "2024-04", dueDate: "2024-04-05", paidOn: "2024-04-06", amount: 8000 },
    { month: "2024-05", dueDate: "2024-05-05", paidOn: "2024-05-05", amount: 8000 },
    { month: "2024-06", dueDate: "2024-06-05", paidOn: "2024-06-07", amount: 8000 },
    { month: "2024-07", dueDate: "2024-07-05", paidOn: "2024-07-05", amount: 8000 },
    { month: "2024-08", dueDate: "2024-08-05", paidOn: "2024-08-05", amount: 8000 },
    { month: "2024-09", dueDate: "2024-09-05", paidOn: "2024-09-06", amount: 8000 },
    { month: "2024-10", dueDate: "2024-10-05", paidOn: "2024-10-05", amount: 8000 },
    { month: "2024-11", dueDate: "2024-11-05", paidOn: "2024-11-04", amount: 8000 },
    { month: "2024-12", dueDate: "2024-12-05", paidOn: "2024-12-05", amount: 8000 },
  ];
}

const db = (() => {
  const globalDb = globalThis as unknown as { roomIdJobStore?: Map<string, StoredJob> };

  if (!globalDb.roomIdJobStore) {
    globalDb.roomIdJobStore = new Map<string, StoredJob>();
  }

  return globalDb.roomIdJobStore;
})();

function signCredential(payload: Omit<RentalCredential, "signature">): string {
  return createHmac("sha256", SIGNING_SECRET).update(JSON.stringify(payload)).digest("hex");
}

export function createUploadJob(files: UploadFiles) {
  const jobId = randomUUID();
  const userId = randomUUID();
  const createdAtMs = Date.now();

  const hash_of_documents = createHash("sha256")
    .update([files.contractFileName, files.paymentsFileName, files.referenceFileName ?? ""].join("|"))
    .digest("hex");

  const metrics = analyzeRentalHistory(buildMockPayments());
  const scoring = scoreRentalMetrics(metrics);

  const payload: Omit<RentalCredential, "signature"> = {
    user_id: userId,
    rental_score: scoring.score,
    tier: scoring.tier,
    months_verified: metrics.totalMonthsAnalyzed,
    on_time_payments: metrics.onTimePayments,
    late_payments: metrics.latePayments,
    defaults: metrics.defaultCount,
    max_delay_days: metrics.maxDelayDays,
    hash_of_documents,
    timestamp: new Date(createdAtMs).toISOString(),
    proof_mode: "simulated",
    zk_ready: true,
    badges: DEMO_ZK_PROOFS,
  };

  const credential: RentalCredential = {
    ...payload,
    signature: signCredential(payload),
  };

  db.set(jobId, {
    id: jobId,
    userId,
    createdAtMs,
    files,
    credential,
  });

  return { jobId, userId };
}

export function readJobStatus(jobId: string): JobStatus | null {
  const job = db.get(jobId);

  if (!job) {
    return null;
  }

  const elapsed = Date.now() - job.createdAtMs;

  for (const stage of PROCESSING_STAGES) {
    if (elapsed <= stage.maxElapsed) {
      return {
        jobId,
        userId: job.userId,
        status: stage.status,
        stepIndex: stage.stepIndex,
        progress: stage.progress,
      };
    }
  }

  return {
    jobId,
    userId: job.userId,
    status: "completed",
    stepIndex: 3,
    progress: 100,
  };
}

export function readRentalScore(userId: string): RentalCredential | null {
  let credential: RentalCredential | null = null;

  db.forEach((job) => {
    if (job.userId === userId) {
      credential = job.credential;
    }
  });

  return credential;
}

export function verifyCredential(credential: RentalCredential) {
  const { signature, ...payload } = credential;
  const expectedSignature = signCredential(payload);

  const hasRequiredFields =
    typeof credential.user_id === "string" &&
    typeof credential.rental_score === "number" &&
    typeof credential.tier === "string" &&
    typeof credential.months_verified === "number" &&
    typeof credential.on_time_payments === "number" &&
    typeof credential.late_payments === "number" &&
    typeof credential.defaults === "number" &&
    typeof credential.max_delay_days === "number" &&
    typeof credential.hash_of_documents === "string" &&
    typeof credential.timestamp === "string" &&
    typeof credential.signature === "string";

  const checks: CredentialChecks = {
    requiredFields: hasRequiredFields,
    scoreRangeValid: credential.rental_score >= 0 && credential.rental_score <= 100,
    tierConsistent: scoreToTier(credential.rental_score) === credential.tier,
    timestampValid: !Number.isNaN(new Date(credential.timestamp).getTime()),
    hashFormatValid: /^[a-f0-9]{64}$/i.test(credential.hash_of_documents),
    signatureValid: signature === expectedSignature,
  };

  const failureReasons: string[] = [];

  if (!checks.requiredFields) {
    failureReasons.push("Missing one or more required credential fields.");
  }
  if (!checks.scoreRangeValid) {
    failureReasons.push("Rental score is outside the expected 0-100 range.");
  }
  if (!checks.tierConsistent) {
    failureReasons.push("Tier does not match score thresholds.");
  }
  if (!checks.timestampValid) {
    failureReasons.push("Credential timestamp is invalid.");
  }
  if (!checks.hashFormatValid) {
    failureReasons.push("Document hash format is invalid.");
  }
  if (!checks.signatureValid) {
    failureReasons.push("Credential signature mismatch.");
  }

  return {
    valid: Object.values(checks).every(Boolean),
    checks,
    reasons: failureReasons,
    expectedSignature,
  };
}
