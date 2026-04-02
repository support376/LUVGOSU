import type { TypePreset, Situation } from "./types";

// ===== 6개 대표 유형 프리셋 =====
export const TYPE_PRESETS: TypePreset[] = [
  {
    id: "avoidant",
    name: "회피형",
    coordinate: { x: 5, y: 3 },
    description: "싸우면 잠수, 감정 표현 안 함",
    oneLiner: "읽씹하고 다음날 아무 일 없던 듯",
    emoji: "🏃",
  },
  {
    id: "anxious",
    name: "불안형",
    coordinate: { x: 1, y: 4 },
    description: "확인 많이 함, 서운함 잘 느낌",
    oneLiner: "읽씹하면 바로 전화 3번",
    emoji: "😰",
  },
  {
    id: "controlling",
    name: "통제형",
    coordinate: { x: 1, y: 1 },
    description: "계획 바뀌면 화냄, 간섭 많음",
    oneLiner: "왜 허락 안 받아?",
    emoji: "👊",
  },
  {
    id: "explosive",
    name: "감정폭발형",
    coordinate: { x: 3, y: 5 },
    description: "평소 괜찮다가 갑자기 폭발",
    oneLiner: "쌓아두다 한번에 터짐",
    emoji: "🌋",
  },
  {
    id: "logical",
    name: "논리형",
    coordinate: { x: 4, y: 1 },
    description: "감정보다 이유 따짐",
    oneLiner: "그게 왜 서운한 건데?",
    emoji: "🧠",
  },
  {
    id: "indifferent",
    name: "무관심형",
    coordinate: { x: 5, y: 1 },
    description: "연락 뜸, 데이트 관심 없음",
    oneLiner: "아 귀찮아 알아서 해",
    emoji: "😶",
  },
];

// ===== 5개 갈등 상황 프리셋 =====
export const SITUATIONS: Situation[] = [
  {
    id: "S1",
    category: "연락/답장",
    title: "읽씹 & 답장 늦음",
    setup: "중요한 얘기를 카톡으로 보냈는데, 상대가 읽고 3시간째 답이 없다.",
    emotionalContext: "어제도 비슷한 일이 있었고, 점점 불안해지는 상황",
    hiddenTrigger: "지난주에 이 문제로 한 번 싸운 적 있음 (반복 패턴)",
    opponentFirstMessage:
      "아 미안 바빴어. 근데 그게 뭐 급한 거였어? 나중에 얘기하면 안 돼?",
  },
  {
    id: "S2",
    category: "약속/계획",
    title: "약속 일방 취소",
    setup: "주말에 같이 여행 가기로 했는데, 상대가 갑자기 친구 모임이 생겼다고 한다.",
    emotionalContext: "이미 숙소 예약까지 해놓은 상태",
    hiddenTrigger: "지난주에도 비슷한 일이 있었음 (반복 패턴)",
    opponentFirstMessage:
      "아 미안 이번 주말에 친구들이 갑자기 모인대... 여행 다음에 가면 안 돼?",
  },
  {
    id: "S3",
    category: "외부 관계",
    title: "이성 친구 문제",
    setup: "상대방 인스타에 이성 친구와 찍은 사진이 올라왔다. 나한테는 말 없이.",
    emotionalContext: "전에 그 친구 얘기를 했을 때 '그냥 친구야'라고만 했었음",
    hiddenTrigger: "상대가 그 친구와 자주 연락하는 걸 이미 알고 있었음",
    opponentFirstMessage:
      "뭐야 그 사진? 그냥 같이 밥 먹었는데 뭐가 문제야? 너무 예민한 거 아니야?",
  },
  {
    id: "S4",
    category: "감정 표현",
    title: '"괜찮아" 뒤의 진심',
    setup: '상대가 힘든 일이 있어 보이는데, 물어보면 "괜찮아"만 반복한다.',
    emotionalContext: "최근 상대가 회사에서 스트레스를 많이 받고 있는 걸 알고 있음",
    hiddenTrigger: "이전에 감정을 공유했다가 가볍게 넘겨진 경험이 있음",
    opponentFirstMessage:
      "아니 진짜 괜찮다니까. 왜 자꾸 물어봐? 피곤해 그냥.",
  },
  {
    id: "S5",
    category: "미래/진지함",
    title: "관계 미래 이야기",
    setup: "사귄 지 1년이 되었는데, 앞으로의 계획에 대한 이야기를 꺼내려 한다.",
    emotionalContext: "주변 친구들이 하나둘 결혼 이야기를 시작하는 시기",
    hiddenTrigger: "상대가 이 주제를 계속 피해왔음",
    opponentFirstMessage:
      "야 갑자기 왜 그런 무거운 얘기를 해? 지금 잘 만나고 있잖아 뭐가 문제야?",
  },
];

// ===== 좌표 → 난이도 =====
export function getDifficulty(x: number, y: number): number {
  const distFromCenter = Math.sqrt((x - 3) ** 2 + (y - 3) ** 2);
  if (distFromCenter <= 1.5) return 1;
  if (distFromCenter <= 2.5) return 3;
  return 5;
}

export function getDifficultyStars(x: number, y: number): string {
  const d = getDifficulty(x, y);
  return "★".repeat(d) + "☆".repeat(5 - d);
}

// ===== 등급 계산 =====
export function getGrade(totalScore: number): "D" | "C" | "B" | "A" | "S" {
  if (totalScore <= 100) return "D";
  if (totalScore <= 200) return "C";
  if (totalScore <= 280) return "B";
  if (totalScore <= 340) return "A";
  return "S";
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case "S": return "text-yellow-400";
    case "A": return "text-green-400";
    case "B": return "text-blue-400";
    case "C": return "text-orange-400";
    case "D": return "text-red-400";
    default: return "text-muted";
  }
}
