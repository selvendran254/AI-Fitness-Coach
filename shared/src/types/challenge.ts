export type ChallengeType = 'STEPS' | 'WORKOUTS' | 'CALORIES' | 'WATER' | 'CUSTOM';

export type ChallengeStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  type: ChallengeType;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
  createdById: string;
  participantCount: number;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  currentValue: number;
  rank?: number;
  joinedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  score: number;
  rank: number;
}
