export interface PorScore {
  userId: string;
  score: number;
  paymentCount: number;
  onTimeCount: number;
  lateCount: number;
  totalPaid: number;
  leaseCount: number;
  completedLeaseCount: number;
  disputeCount: number;
  merkleRoot: string | null;
  lastPaymentAt: string | null;
}

export interface PorBreakdown {
  punctuality: number;
  completion: number;
  tenure: number;
  disputeFree: number;
}

export interface PorBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface PorTrend {
  month: string;
  score: number;
}
