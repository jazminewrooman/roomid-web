export type Tier = "A" | "B" | "C" | "D";

export type PaymentRecord = {
  month: string;
  dueDate: string;
  paidOn?: string;
  amount: number;
};

export type RentalMetrics = {
  totalMonthsAnalyzed: number;
  onTimePayments: number;
  latePayments: number;
  maxDelayDays: number;
  defaultCount: number;
  consecutivePaidMonths: number;
};

export type ScoreResult = {
  score: number;
  tier: Tier;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function daysBetween(fromIsoDate: string, toIsoDate: string) {
  const from = new Date(fromIsoDate).getTime();
  const to = new Date(toIsoDate).getTime();

  return Math.floor((to - from) / DAY_IN_MS);
}

export function analyzeRentalHistory(payments: PaymentRecord[]): RentalMetrics {
  const metrics: RentalMetrics = {
    totalMonthsAnalyzed: payments.length,
    onTimePayments: 0,
    latePayments: 0,
    maxDelayDays: 0,
    defaultCount: 0,
    consecutivePaidMonths: 0,
  };

  let runningConsecutivePaidMonths = 0;

  for (const payment of payments) {
    if (!payment.paidOn) {
      metrics.defaultCount += 1;
      runningConsecutivePaidMonths = 0;
      continue;
    }

    const delayDays = Math.max(0, daysBetween(payment.dueDate, payment.paidOn));
    metrics.maxDelayDays = Math.max(metrics.maxDelayDays, delayDays);
    runningConsecutivePaidMonths += 1;
    metrics.consecutivePaidMonths = Math.max(
      metrics.consecutivePaidMonths,
      runningConsecutivePaidMonths,
    );

    if (delayDays > 30) {
      metrics.defaultCount += 1;
      runningConsecutivePaidMonths = 0;
      continue;
    }

    if (delayDays > 5) {
      metrics.latePayments += 1;
      continue;
    }

    metrics.onTimePayments += 1;
  }

  return metrics;
}

export function scoreRentalMetrics(metrics: RentalMetrics): ScoreResult {
  let score = 100;

  score -= metrics.latePayments * 5;
  score -= metrics.defaultCount * 20;

  if (metrics.consecutivePaidMonths >= 12) {
    score += 5;
  }

  const boundedScore = Math.max(0, Math.min(100, score));

  return {
    score: boundedScore,
    tier: scoreToTier(boundedScore),
  };
}

export function scoreToTier(score: number): Tier {
  if (score >= 90) {
    return "A";
  }

  if (score >= 75) {
    return "B";
  }

  if (score >= 60) {
    return "C";
  }

  return "D";
}
