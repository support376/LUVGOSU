// ===== 좌표 시스템 =====
export interface Coordinate {
  x: number; // 관계 거리: 1(집착) ~ 5(회피)
  y: number; // 감정 표현: 1(억제) ~ 5(폭발)
}

// ===== 유형 프리셋 =====
export interface TypePreset {
  id: string;
  name: string;
  coordinate: Coordinate;
  description: string;
  oneLiner: string;
  emoji: string;
}

// ===== 상황 프리셋 =====
export interface Situation {
  id: string;
  category: string;
  title: string;
  setup: string;
  emotionalContext: string;
  hiddenTrigger: string;
  opponentFirstMessage: string;
}

// ===== 관계 목표 =====
export type GoalId = "reconciliation" | "dominance" | "empathy" | "closure";

export interface Goal {
  id: GoalId;
  name: string;
  description: string;
  emoji: string;
  axisLabels: [string, string, string, string];
  warning?: string;
}

// ===== 채팅 =====
export interface ChatMessage {
  role: "user" | "opponent" | "system";
  content: string;
  turn: number;
}

// ===== 채점 =====
export interface AxisScore {
  score: number;
  feedback: string;
  details: string[];
}

export interface ScoreResult {
  axis1: AxisScore;
  axis2: AxisScore;
  axis3: AxisScore;
  axis4: AxisScore;
  totalScore: number;
  grade: "D" | "C" | "B" | "A" | "S";
  bestMoment: { turn: number; description: string };
  improveMoment: { turn: number; original: string; alternative: string };
  patternDetected: string;
}

// ===== 세션 =====
export interface SimulationSession {
  id: string;
  coordinate: Coordinate;
  situation: Situation;
  goal: GoalId;
  messages: ChatMessage[];
  score?: ScoreResult;
  createdAt: string;
}

// ===== 스탯 카드 =====
export interface StatCard {
  totalSessions: number;
  avgAxis1: number;
  avgAxis2: number;
  avgAxis3: number;
  avgAxis4: number;
  totalScore: number;
  grade: string;
  typeName: string;
  strength: string;
  weakness: string;
}
