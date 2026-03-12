type BadgeTone = "success" | "info" | "neutral";

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  return <span className={`roomid-badge roomid-badge-${tone}`}>{label}</span>;
}
