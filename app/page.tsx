"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CredentialCard } from "@/components/ui/CredentialCard";
import { StepStatus } from "@/components/ui/StepStatus";
import { Toast } from "@/components/ui/Toast";
import { UploadPanel } from "@/components/ui/UploadPanel";

const processingStepLabels = [
  "Analyzing documents",
  "Extracting payment history",
  "Computing reliability score",
  "Generating zk-proof",
] as const;

const demoZkProofs = [
  "🥇 Proof of Income Threshold",
  "🥈 Proof of Rental Affordability Ratio",
  "🥉 Proof of No-Default History",
] as const;

type ViewState = "landing" | "upload" | "processing" | "result";
type FileKey = "contract" | "payments" | "reference";

type FileState = {
  contract: File | null;
  payments: File | null;
  reference: File | null;
};

const ALLOWED_EXTENSIONS = /\.(pdf|jpg|jpeg|png)$/i;

function FlowStepper({ currentView }: { currentView: Exclude<ViewState, "landing"> }) {
  const steps: Array<{ id: Exclude<ViewState, "landing">; label: string; description: string }> = [
    { id: "upload", label: "Upload", description: "Attach documents" },
    { id: "processing", label: "Analysis", description: "AI processing" },
    { id: "result", label: "Credential", description: "Your RoomID" },
  ];
  const currentIndex = steps.findIndex((s) => s.id === currentView);

  return (
    <nav className="flow-stepper" aria-label="Verification progress">
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;
        return (
          <div key={step.id} className="stepper-item">
            <div className={`stepper-step${isDone ? " step-done" : isActive ? " step-active" : " step-upcoming"}`}>
              <span className="stepper-dot">
                {isDone ? (
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </span>
              <div className="stepper-text">
                <span className="stepper-label">{step.label}</span>
                <span className="stepper-description">{step.description}</span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`stepper-connector${isDone ? " connector-done" : ""}`} aria-hidden="true" />
            )}
          </div>
        );
      })}
    </nav>
  );
}

const initialFiles: FileState = { contract: null, payments: null, reference: null };

type RentalCredential = {
  user_id: string;
  rental_score: number;
  tier: "A" | "B" | "C" | "D";
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

export default function RoomIdPage() {
  const [view, setView] = useState<ViewState>("landing");
  const [files, setFiles] = useState<FileState>(initialFiles);
  const [errors, setErrors] = useState<Partial<Record<FileKey, string>>>({});
  const [flowError, setFlowError] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const [jobId, setJobId] = useState("");
  const [userId, setUserId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [credential, setCredential] = useState<RentalCredential | null>(null);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [roomFiSubmitted, setRoomFiSubmitted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "info" | "error" = "info") => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    const handler = () => {
      setFiles(initialFiles);
      setErrors({});
      setFlowError("");
      setActiveStep(0);
      setJobId("");
      setUserId("");
      setCredential(null);
      setVerificationMessage("");
      setToast(null);
      setRoomFiSubmitted(false);
      setView("landing");
    };
    window.addEventListener("roomid:reset", handler);
    return () => window.removeEventListener("roomid:reset", handler);
  }, []);

  const landingSignal = useMemo(() => {
    const pool = [
      { score: 94, tier: "A", months: 18, maxDelay: 1, defaults: 0 },
      { score: 88, tier: "A", months: 14, maxDelay: 3, defaults: 0 },
      { score: 91, tier: "A", months: 12, maxDelay: 2, defaults: 0 },
      { score: 96, tier: "A", months: 24, maxDelay: 0, defaults: 0 },
      { score: 79, tier: "B", months: 11, maxDelay: 6, defaults: 0 },
      { score: 83, tier: "B", months: 16, maxDelay: 5, defaults: 0 },
    ];
    const idx = Math.floor(Date.now() / 86_400_000) % pool.length;
    return pool[idx];
  }, []);

  useEffect(() => {
    if (view !== "processing" || !jobId || !userId) return;
    setFlowError("");
    const interval = setInterval(async () => {
      try {
        const statusRes = await fetch(`/api/job-status/${jobId}`);
        if (!statusRes.ok) throw new Error("Unable to read job status");
        const status = (await statusRes.json()) as { status: "queued" | "processing" | "completed"; stepIndex: number };
        setActiveStep(status.stepIndex);
        if (status.status === "completed") {
          clearInterval(interval);
          const scoreRes = await fetch(`/api/rental-score/${userId}`);
          if (!scoreRes.ok) throw new Error("Unable to read rental score");
          const nextCredential = (await scoreRes.json()) as RentalCredential;
          setCredential(nextCredential);
          setView("result");
        }
      } catch {
        clearInterval(interval);
        setFlowError("Processing failed. Please retry your upload.");
        setView("upload");
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [view, jobId, userId]);

  const processingSteps = useMemo(
    () => processingStepLabels.map((label, index) => ({
      label,
      state: index < activeStep ? ("done" as const) : index === activeStep ? ("active" as const) : ("todo" as const),
    })),
    [activeStep],
  );

  const onFileSelect = (key: FileKey, file: File | null) => {
    if (!file) {
      setFiles((c) => ({ ...c, [key]: null }));
      setErrors((c) => ({ ...c, [key]: "" }));
      return;
    }
    if (!ALLOWED_EXTENSIONS.test(file.name)) {
      setErrors((c) => ({ ...c, [key]: "Unsupported format. Use PDF, JPG, or PNG." }));
      return;
    }
    setFiles((c) => ({ ...c, [key]: file }));
    setErrors((c) => ({ ...c, [key]: "" }));
  };

  const startProcessing = () => {
    const nextErrors: Partial<Record<FileKey, string>> = {};
    if (!files.contract) nextErrors.contract = "Rental contract is required.";
    if (!files.payments) nextErrors.payments = "Payment proofs are required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFlowError("Please upload all required files before continuing.");
      return;
    }
    void (async () => {
      try {
        setUploading(true);
        setFlowError("");
        setVerificationMessage("");
        const formData = new FormData();
        formData.append("contract", files.contract as File);
        formData.append("payments", files.payments as File);
        if (files.reference) formData.append("reference", files.reference);
        const response = await fetch("/api/upload-documents", { method: "POST", body: formData });
        if (!response.ok) throw new Error("Upload failed");
        const data = (await response.json()) as { jobId: string; userId: string };
        setJobId(data.jobId);
        setUserId(data.userId);
        setActiveStep(0);
        setView("processing");
      } catch {
        setFlowError("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    })();
  };

  const verifyCurrentCredential = async () => {
    if (!credential) return;
    setVerificationMessage("Verifying credential...");
    const response = await fetch("/api/verify-credential", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    if (!response.ok) { setVerificationMessage("Verification failed."); return; }
    const data = (await response.json()) as { valid: boolean; message: string; reasons?: string[] };
    if (data.valid) { setVerificationMessage(data.message); return; }
    const reasons = data.reasons?.length ? ` ${data.reasons.join(" ")}` : "";
    setVerificationMessage(`${data.message}.${reasons}`.trim());
  };

  const useInRoomFi = () => {
    if (!credential) return;
    setRoomFiSubmitted(true);
    showToast("Credential submitted to RoomFi. A landlord can now verify it in real time.", "success");
  };

  const shareCredential = async () => {
    if (!credential) return;
    const sharePayload = `RoomID Credential\nUser: ${credential.user_id}\nScore: ${credential.rental_score} (${credential.tier})\nVerified Months: ${credential.months_verified}`;
    if (navigator.share) {
      await navigator.share({ title: "RoomID Credential", text: sharePayload });
      showToast("Credential shared.", "success");
      return;
    }
    await navigator.clipboard.writeText(sharePayload);
    showToast("Share not supported — summary copied to clipboard.", "info");
  };

  const downloadProof = () => {
    if (!credential) return;
    const blob = new Blob([JSON.stringify(credential, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `roomid-proof-${credential.user_id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("Proof JSON downloaded.", "success");
  };

  const resetFlow = () => {
    setFiles(initialFiles); setErrors({}); setFlowError(""); setActiveStep(0);
    setJobId(""); setUserId(""); setCredential(null); setVerificationMessage("");
    setToast(null); setRoomFiSubmitted(false); setView("landing");
  };

  return (
    <main className="roomid-page">
      {view === "landing" ? (
        <header className="hero">
          <p className="eyebrow">RoomID · Privacy Layer</p>
          <h1>Prove your rental reliability without revealing private data.</h1>
          <p className="hero-copy">Turn rental history into a portable, privacy-preserving credential.</p>
          <div className="hero-badges">
            <Badge label="Powered by Noir (Aztec)" tone="info" />
            <Badge label="Privacy Proof Enabled" tone="success" />
            <Badge label="zk-Ready Architecture" tone="neutral" />
          </div>
        </header>
      ) : (
        <FlowStepper currentView={view} />
      )}

      {view === "landing" ? (
        <section className="view-transition landing-showcase">
          <div className="landing-main-hero-media">
            <Image src="/roomid2.jpg" alt="RoomID privacy-focused rental identity hero" width={2000} height={1200} priority />
          </div>
          <div id="verify" className="landing-hero-card">
            <p className="landing-kicker">Infrastructure for the next generation of rental markets</p>
            <h2>Convert your payment history into a <span>verifiable trust layer</span>.</h2>
            <p className="hero-copy">RoomID transforms rental evidence into a portable credential designed for compliance, privacy and instant verification inside the Room ecosystem.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => setView("upload")}>Create RoomID</button>
              <button className="btn btn-secondary" onClick={() => setView("upload")}>Upload Rental History</button>
            </div>
            <div className="landing-metrics">
              <article><p>Avg. verification</p><strong>02:40 min</strong></article>
              <article><p>Data exposure</p><strong>Minimal</strong></article>
              <article><p>Credential mode</p><strong>zk-ready</strong></article>
            </div>
          </div>
          <div className="landing-signal-panel">
            <p className="signal-title">Live Trust Signal</p>
            <p className="signal-score">{landingSignal.score} / 100</p>
            <p className="signal-tier">Tier {landingSignal.tier} · {landingSignal.tier === "A" ? "Excellent rental reliability" : "Strong rental reliability"}</p>
            <ul>
              <li>{landingSignal.months} months verified payment continuity</li>
              <li>{landingSignal.defaults === 0 ? "No defaults reported in analyzed period" : `${landingSignal.defaults} default(s) in analyzed period`}</li>
              <li>Maximum delay observed: {landingSignal.maxDelay} {landingSignal.maxDelay === 1 ? "day" : "days"}</li>
            </ul>
            <div className="signal-grid">
              {demoZkProofs.map((proof) => (<span key={proof}>{proof}</span>))}
            </div>
          </div>
          <div className="landing-feature-grid">
            <Card className="landing-feature-card" title="Portable Identity" subtitle="Use one credential across RoomFi and future partners">
              <span className="feature-icon" aria-hidden><svg viewBox="0 0 24 24" fill="none"><path d="M7 9.5A2.5 2.5 0 0 1 9.5 7h5A2.5 2.5 0 0 1 17 9.5V17H7V9.5Z" /><path d="M9 7V5.8C9 4.81 9.81 4 10.8 4h2.4C14.19 4 15 4.81 15 5.8V7" /><path d="M6 17h12" /></svg></span>
              <p className="hero-copy">Avoid repeated manual reviews and accelerate tenant onboarding.</p>
            </Card>
            <Card className="landing-feature-card" title="Privacy by Default" subtitle="Share outcomes, not raw sensitive documents">
              <span className="feature-icon" aria-hidden><svg viewBox="0 0 24 24" fill="none"><path d="M5 19h14" /><path d="M7.5 19V12.5" /><path d="M12 19V9" /><path d="M16.5 19V6" /></svg></span>
              <p className="hero-copy">Financial and personal details stay abstracted behind verifiable proofs.</p>
            </Card>
            <Card className="landing-feature-card" title="Crypto-Credibility" subtitle="Demo today, circuit-ready tomorrow">
              <span className="feature-icon" aria-hidden><svg viewBox="0 0 24 24" fill="none"><path d="M8.5 14.5H8.51" /><path d="M15.5 14.5H15.51" /><path d="M6.2 17.8c1.5-1.25 3.6-2 5.8-2s4.3.75 5.8 2" /><path d="M5 12c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7" /></svg></span>
              <p className="hero-copy">Architecture prepared to migrate from simulated proofs to Noir circuits.</p>
            </Card>
          </div>
          <section id="how-roomid-works" className="how-roomid-works" aria-label="How RoomID Works">
            <h3>How RoomID Works</h3>
            <div className="how-roomid-steps">
              <article className="how-step"><p className="how-step-index">1</p><h4>Upload rental documents</h4><p>Contracts, payment transfers, rent receipts.</p></article>
              <div className="how-step-arrow" aria-hidden>⬇</div>
              <article className="how-step"><p className="how-step-index">2</p><h4>AI analyzes payment history</h4><p>Extracts rent amount, payment dates, reliability metrics.</p></article>
              <div className="how-step-arrow" aria-hidden>⬇</div>
              <article className="how-step"><p className="how-step-index">3</p><h4>Generate privacy-preserving credential</h4><p>A portable rental score that can be used in RoomFi.</p></article>
            </div>
          </section>
        </section>
      ) : null}

      {view === "upload" ? (
        <div className="view-transition">
          <section className="roomid-grid">
            <UploadPanel id="rental-contract" title="Upload Rental Contract" helper="Accepted: PDF, JPG, PNG" fileName={files.contract?.name} error={errors.contract} onFileSelect={(f) => onFileSelect("contract", f)} />
            <UploadPanel id="payment-proofs" title="Upload Payment Proofs" helper="Accepted: PDF, JPG, PNG" fileName={files.payments?.name} error={errors.payments} onFileSelect={(f) => onFileSelect("payments", f)} />
            <UploadPanel id="landlord-reference" title="Optional Landlord Reference" helper="Accepted: PDF, JPG, PNG" required={false} fileName={files.reference?.name} error={errors.reference} onFileSelect={(f) => onFileSelect("reference", f)} />
          </section>
          <section className="single-card-section">
            <Card title="Upload status" subtitle="Required documents must be attached before processing">
              {flowError ? <p className="flow-error">{flowError}</p> : <p className="flow-ok">Ready to continue once files are attached.</p>}
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={startProcessing} disabled={uploading}>{uploading ? "Uploading..." : "Start Verification"}</button>
                <button className="btn btn-secondary" onClick={resetFlow}>Cancel</button>
              </div>
            </Card>
          </section>
        </div>
      ) : null}

      {view === "processing" ? (
        <section className="view-transition single-card-section">
          <div className="processing-hero">
            <div className="processing-icon-wrap" aria-hidden="true">
              <div className="processing-ring" />
              <svg className="processing-shield-icon" viewBox="0 0 56 56" fill="none">
                <path d="M28 6L10 16v14c0 11.8 7.8 22.8 18 25.7C38.2 52.8 46 41.8 46 30V16L28 6Z" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 29l5 5 9-10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="processing-title">Analyzing your documents</h2>
            <p className="processing-subtitle">Our AI is extracting your rental history and computing a privacy-preserving trust score.</p>
          </div>
          <Card className="processing-card">
            <div className="processing-progress-header">
              <span className="processing-step-label">{processingStepLabels[Math.min(activeStep, processingStepLabels.length - 1)]}</span>
              <span className="processing-step-counter">{Math.min(activeStep + 1, processingStepLabels.length)} / {processingStepLabels.length}</span>
            </div>
            <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(((activeStep + 1) / processingStepLabels.length) * 100)}>
              <span className="progress-bar" style={{ width: `${((activeStep + 1) / processingStepLabels.length) * 100}%` }} />
            </div>
            <StepStatus steps={processingSteps} />
          </Card>
        </section>
      ) : null}

      {view === "result" ? (
        <section className="view-transition single-card-section">
          <div className="result-success-banner">
            <div className="result-check-wrap" aria-hidden="true">
              <svg className="result-check-icon" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" strokeWidth="2" />
                <path d="M14 25l7 7 13-14" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="result-title">Your RoomID is ready</h2>
              <p className="result-subtitle">Credential generated and cryptographically signed.</p>
            </div>
          </div>
          {credential ? <CredentialCard score={credential.rental_score} tier={credential.tier} monthsVerified={credential.months_verified} defaults={credential.defaults} maxDelayDays={credential.max_delay_days} /> : null}
          <Card title="Submit or share your credential" subtitle="Use your RoomID proof in connected products">
            <div className="hero-actions">
              {roomFiSubmitted ? (
                <button className="btn btn-primary btn-submitted" disabled>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5L6.5 12L13 5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Submitted to RoomFi
                </button>
              ) : (
                <button className="btn btn-primary" onClick={useInRoomFi}>Use in RoomFi</button>
              )}
              <button className="btn btn-secondary" onClick={shareCredential}>Share Credential</button>
              <button className="btn btn-secondary" onClick={downloadProof}>Download Proof</button>
              <button className="btn btn-secondary" onClick={verifyCurrentCredential}>Verify Credential</button>
            </div>
            {credential ? (
              <div className="credential-meta">
                <div className="credential-stats-row">
                  <div className="credential-stat"><span className="credential-stat-value">{credential.on_time_payments}</span><span className="credential-stat-label">On-time payments</span></div>
                  <div className="credential-stat"><span className="credential-stat-value">{credential.late_payments}</span><span className="credential-stat-label">Late payments</span></div>
                  <div className="credential-stat"><span className="credential-stat-value">{credential.defaults}</span><span className="credential-stat-label">Defaults</span></div>
                  <div className="credential-stat"><span className="credential-stat-value">{credential.months_verified}</span><span className="credential-stat-label">Months verified</span></div>
                </div>
                <div className="credential-proofs-row">
                  {credential.badges.map((proof) => <Badge key={proof} label={proof} tone="info" />)}
                </div>
              </div>
            ) : null}
            {verificationMessage ? (
              <p className={`verify-message${verificationMessage.toLowerCase().includes("fail") || verificationMessage.toLowerCase().includes("invalid") ? " verify-message-error" : " verify-message-ok"}`}>
                {verificationMessage}
              </p>
            ) : null}
            <div className="hero-actions">
              <button className="btn btn-secondary" onClick={resetFlow}>Create Another RoomID</button>
            </div>
          </Card>
        </section>
      ) : null}

      {toast ? <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} /> : null}
    </main>
  );
}
