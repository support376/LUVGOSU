import type { TypePreset, Situation, Goal } from "./types";

// ===== 4개 관계 목표 =====
export const GOALS: Goal[] = [
  {
    id: "reconciliation",
    name: "화해",
    description: "갈등을 풀고 관계를 회복하는 것이 목표",
    emoji: "🤝",
    axisLabels: ["독소 회피", "감정 반응성", "수용적 대응", "책임 인정"],
  },
  {
    id: "dominance",
    name: "주도권 확보",
    description: "심리적 우위를 가져와 상대가 더 매달리게 만드는 것이 목표",
    emoji: "👑",
    axisLabels: ["희소성 시그널링", "프레임 컨트롤", "투자 비대칭", "감정 밀당 조율"],
    warning: "이 목표는 조작적 성격이 있습니다. 교육적 목적으로만 활용하세요.",
  },
  {
    id: "empathy",
    name: "진심 끌어내기",
    description: "상대의 방어벽을 허물고 본심을 말하게 하는 것이 목표",
    emoji: "💎",
    axisLabels: ["타당화 깊이", "상호 자기개방", "반영적 경청", "안전 공간 구축"],
  },
  {
    id: "closure",
    name: "쿨한 정리",
    description: "감정 소모 없이 깔끔하게 선 긋는 것이 목표",
    emoji: "✂️",
    axisLabels: ["입장 명확성", "NVC 준수", "감정 억제력", "존엄 보존"],
  },
];

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

// ===== 갈등 상황 프리셋 =====
export const SITUATIONS: Situation[] = [
  // ── 기존 5개 ──
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
  // ── 돈/경제 ──
  {
    id: "S6",
    category: "돈/경제",
    title: "데이트 비용 분담",
    setup: "오늘도 내가 계산했다. 사귄 지 6개월인데, 비용 분담이 너무 한쪽으로 기울어 있다.",
    emotionalContext: "돈 얘기 꺼내면 쪼잔하다고 할까 봐 참아왔지만 한계에 도달",
    hiddenTrigger: "지난달 카드값이 평소의 2배가 나왔음",
    opponentFirstMessage:
      "어 고마워~ 다음에 내가 살게. 근데 굳이 그런 거 따지면 재미없지 않아?",
  },
  {
    id: "S7",
    category: "돈/경제",
    title: "경제력 무시",
    setup: "상대가 내 직업이나 수입에 대해 은근히 무시하는 말을 했다.",
    emotionalContext: "주변 사람들 앞에서 한 말이라 더 자존심이 상한 상태",
    hiddenTrigger: "상대 부모님도 비슷한 말을 한 적 있음",
    opponentFirstMessage:
      "아 그냥 농담이었잖아. 왜 그렇게 예민해? 사실대로 말한 건데 뭐가 문제야?",
  },
  // ── 잠자리/스킨십 ──
  {
    id: "S8",
    category: "잠자리",
    title: "스킨십 온도차",
    setup: "최근 한 달간 스킨십이 거의 없다. 상대가 계속 피곤하다고 거부한다.",
    emotionalContext: "거절당할수록 매력 없는 건가 자존감이 떨어지는 중",
    hiddenTrigger: "상대가 스트레스인지, 나에 대한 감정이 변한 건지 확신이 없음",
    opponentFirstMessage:
      "또 그 얘기야? 나 요즘 진짜 피곤하다고 했잖아. 꼭 그래야 확인이 돼?",
  },
  // ── 가족/부모님 ──
  {
    id: "S9",
    category: "가족",
    title: "명절 갈등",
    setup: "이번 추석에도 상대 집에만 가자고 한다. 우리 부모님은 3번 연속 못 뵌 상태.",
    emotionalContext: "부모님이 서운해하시는 걸 알면서도 매번 양보해왔음",
    hiddenTrigger: "상대는 자기 부모님 편이 당연하다고 생각함",
    opponentFirstMessage:
      "우리 엄마가 벌써 준비하고 있는데 어떡해. 니네는 다음에 가면 안 돼?",
  },
  {
    id: "S10",
    category: "가족",
    title: "시부모/장인장모 간섭",
    setup: "상대 부모님이 우리 관계에 지나치게 간섭한다. 상대는 부모님 편을 든다.",
    emotionalContext: "어제 상대 어머니가 내 생활 방식에 대해 직접 전화로 지적함",
    hiddenTrigger: "상대가 부모님 앞에서 나를 한 번도 감싸준 적이 없음",
    opponentFirstMessage:
      "우리 엄마가 널 위해서 하는 말인데 왜 그렇게 받아들여? 좀 맞춰주면 안 돼?",
  },
  {
    id: "S11",
    category: "가족",
    title: "부모님 모시기",
    setup: "상대가 결혼 후 부모님과 같이 살아야 한다고 말했다.",
    emotionalContext: "나는 독립적인 신혼 생활을 기대하고 있었음",
    hiddenTrigger: "상대 아버지 건강이 안 좋아진 상태",
    opponentFirstMessage:
      "아버지 건강도 안 좋으신데 당연히 모셔야지. 효도가 뭔지 모르는 거야?",
  },
  // ── 전 애인 ──
  {
    id: "S12",
    category: "전 애인",
    title: "전 연인 SNS",
    setup: "상대가 전 여자/남자친구 인스타를 아직 팔로우하고 있고, 가끔 좋아요를 누른다.",
    emotionalContext: "한 달 전에 정리해달라고 했는데 아직도 그대로",
    hiddenTrigger: "전 연인이 최근 상대에게 DM을 보낸 것을 발견함",
    opponentFirstMessage:
      "그냥 SNS잖아 좋아요 하나가 뭐 어때서? 네가 너무 집착하는 거야.",
  },
  {
    id: "S13",
    category: "전 애인",
    title: "전 애인 비교",
    setup: "상대가 말끝마다 전 남자/여자친구는 이런 거 잘해줬다고 비교한다.",
    emotionalContext: "처음엔 참았는데 반복되니까 자존심이 바닥",
    hiddenTrigger: "상대가 전 연인에게 아직 미련이 있는 것 같은 의심",
    opponentFirstMessage:
      "아 비교하는 게 아니라 그냥 예를 든 거지. 왜 그렇게 자신감이 없어?",
  },
  // ── 생활습관 ──
  {
    id: "S14",
    category: "생활습관",
    title: "술/유흥 문제",
    setup: "상대가 주 3회 이상 술자리에 간다. 어젯밤에도 만취 상태로 새벽에 들어왔다.",
    emotionalContext: "오늘 같이 하기로 한 약속도 술 때문에 또 깨졌음",
    hiddenTrigger: "건강도 걱정되고, 이 패턴이 점점 심해지고 있음",
    opponentFirstMessage:
      "좀 마실 수도 있지 왜 그래. 내가 일하고 스트레스 푸는 건데 그것도 참견이야?",
  },
  {
    id: "S15",
    category: "생활습관",
    title: "가사 분담",
    setup: "같이 사는데 청소, 설거지, 빨래를 나만 한다. 상대는 시켜야 겨우 한다.",
    emotionalContext: "매번 얘기해도 며칠 하다 원래대로 돌아감",
    hiddenTrigger: "상대는 자기가 충분히 하고 있다고 생각함",
    opponentFirstMessage:
      "나도 하잖아 가끔? 너가 기준이 너무 높은 거 아니야? 좀 편하게 살자.",
  },
  {
    id: "S16",
    category: "생활습관",
    title: "게임/폰 과몰입",
    setup: "같이 있을 때도 상대가 계속 폰만 본다. 대화를 해도 건성으로 대답한다.",
    emotionalContext: "데이트 중에도 게임하다가 큰 싸움을 한 적 있음",
    hiddenTrigger: "상대는 자기 시간이 필요하다고 생각하지만, 나는 무시당하는 느낌",
    opponentFirstMessage:
      "잠깐 본 건데 뭐 어때서. 24시간 너만 쳐다봐야 해? 좀 숨 막혀.",
  },
  // ── 신뢰/거짓말 ──
  {
    id: "S17",
    category: "신뢰",
    title: "거짓말 발각",
    setup: "상대가 회사에 있다고 했는데, 인스타 스토리를 보니 친구들과 놀고 있었다.",
    emotionalContext: "거짓말 자체보다 왜 솔직하게 말 못 하는지가 더 상처",
    hiddenTrigger: "이전에도 사소한 거짓말이 몇 번 있었음",
    opponentFirstMessage:
      "아 그건 말하면 너가 또 예민하게 굴까 봐 그런 거지. 뭐 큰일이라고?",
  },
  {
    id: "S18",
    category: "신뢰",
    title: "몰래 만남",
    setup: "안 만난다고 한 사람을 몰래 만난 걸 알게 됐다.",
    emotionalContext: "신뢰가 완전히 무너진 상태, 분노보다 허탈함이 큼",
    hiddenTrigger: "그 사람과의 관계를 여러 번 확인했고 매번 아니라고 했었음",
    opponentFirstMessage:
      "아 그게... 우연히 마주친 거야. 일부러 만난 거 아닌데 왜 그래?",
  },
  // ── 결혼/동거 ──
  {
    id: "S19",
    category: "결혼/동거",
    title: "결혼 압박",
    setup: "사귄 지 3년차, 결혼 얘기를 꺼냈더니 상대가 계속 피한다.",
    emotionalContext: "부모님도 슬슬 물어보시고, 주변 친구들은 다 결혼함",
    hiddenTrigger: "상대가 결혼을 피하는 이유가 나 때문인지, 결혼 제도 자체인지 모름",
    opponentFirstMessage:
      "왜 자꾸 결혼 결혼 그래? 지금 이대로 좋잖아. 종이 한 장이 뭐가 중요해?",
  },
  {
    id: "S20",
    category: "결혼/동거",
    title: "동거 제안 거절",
    setup: "같이 살자고 했더니 상대가 거부했다. 이유는 애매하게 말한다.",
    emotionalContext: "관계의 진지함을 의심하게 되는 상황",
    hiddenTrigger: "상대 부모님이 동거를 강하게 반대하고 있음",
    opponentFirstMessage:
      "지금 각자 잘 살고 있잖아 굳이 왜? 아직 준비가 안 됐어 그냥.",
  },
  // ── 외모/자존감 ──
  {
    id: "S21",
    category: "외모/자존감",
    title: "외모 지적",
    setup: "상대가 최근 들어 내 외모에 대해 은근히 지적하는 말을 반복한다.",
    emotionalContext: "농담처럼 말하지만 들을 때마다 자존감이 깎이는 중",
    hiddenTrigger: "상대 친구들 앞에서도 비슷한 말을 한 적 있음",
    opponentFirstMessage:
      "아 농담인데 왜 그래 진지하게. 건강 생각해서 하는 말이야 뚱뚱하면 안 좋잖아.",
  },
  // ── 커리어/시간 ──
  {
    id: "S22",
    category: "커리어",
    title: "워커홀릭",
    setup: "상대가 매일 야근이다. 주말에도 노트북을 펴고 일한다. 우리 시간이 없다.",
    emotionalContext: "대화를 해도 항상 피곤하다, 바쁘다 뿐이라 외로움이 극에 달함",
    hiddenTrigger: "상대는 승진 준비 중이라 지금이 중요한 시기라고 생각함",
    opponentFirstMessage:
      "미안한데 지금 진짜 중요한 시기야. 좀만 이해해주면 안 돼? 너도 알잖아.",
  },
  {
    id: "S23",
    category: "커리어",
    title: "진로 반대",
    setup: "내가 하고 싶은 일(이직/창업/유학)에 대해 상대가 강하게 반대한다.",
    emotionalContext: "내 꿈을 응원해주지 않는다는 느낌에 서운함이 큼",
    hiddenTrigger: "상대는 경제적 불안정과 관계 위기를 걱정하고 있음",
    opponentFirstMessage:
      "그거 해서 뭐 되겠어? 현실적으로 생각해봐. 우리한테 리스크가 너무 크잖아.",
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
