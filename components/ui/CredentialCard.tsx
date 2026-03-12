import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type CredentialCardProps = {
  score: number;
  tier: "A" | "B" | "C" | "D";
  monthsVerified: number;
  defaults: number;
  maxDelayDays: number;
};

export function CredentialCard({
  score,
  tier,
  monthsVerified,
  defaults,
  maxDelayDays,
}: CredentialCardProps) {
  const tierReliabilityLabel: Record<CredentialCardProps["tier"], string> = {
    A: "Excellent Rental Reliability",
    B: "Strong Rental Reliability",
    C: "Fair Rental Reliability",
    D: "Needs Improvement",
  };

  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
  const tierClass = `tier-${tier.toLowerCase()}`;

  return (
    <Card title="Rental Reliability Score" className="credential-card">
      <div className={`credit-score-visual ${tierClass}`}>
        <div className="credit-score-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={normalizedScore}>
          <span className="credit-score-fill" style={{ width: `${normalizedScore}%` }} />
        </div>
        <p className="credential-score">{normalizedScore} / 100</p>
        <div className="credential-headline">
          <p className="credit-tier-text">Tier {tier}</p>
          <Badge label={tierReliabilityLabel[tier]} tone={tier === "A" ? "success" : "info"} />
        </div>
      </div>
      <ul className="credential-list">
        <li>{monthsVerified} months verified</li>
        <li>{defaults} defaults</li>
        <li>Max delay: {maxDelayDays} days</li>
      </ul>
    </Card>
  );
}
