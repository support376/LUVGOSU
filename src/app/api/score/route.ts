import { buildScoringPrompt } from "@/lib/prompts";
import { SITUATIONS } from "@/lib/data";
import type { Coordinate, ChatMessage, ScoreResult, GoalId, Gender, ConflictRole } from "@/lib/types";
import { getGrade } from "@/lib/data";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    coordinate,
    situationId,
    goal,
    myGender,
    opponentGender,
    role,
    messages,
  }: {
    coordinate: Coordinate;
    situationId: string;
    goal: GoalId;
    myGender: Gender;
    opponentGender: Gender;
    role: ConflictRole;
    messages: ChatMessage[];
  } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const situation = SITUATIONS.find((s) => s.id === situationId);
  if (!situation) {
    return Response.json({ error: "잘못된 상황 ID" }, { status: 400 });
  }

  const scoringPrompt = buildScoringPrompt(messages, coordinate, situation, goal, myGender, opponentGender, role);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: scoringPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json(
      { error: `Claude API 오류: ${err}` },
      { status: res.status },
    );
  }

  const data = await res.json();
  const text =
    data.content?.[0]?.type === "text" ? data.content[0].text : "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return Response.json(
      { error: "채점 결과 파싱 실패" },
      { status: 500 },
    );
  }

  let parsed: ScoreResult;
  try {
    parsed = JSON.parse(jsonMatch[0]) as ScoreResult;
  } catch {
    return Response.json(
      { error: "채점 결과 JSON 파싱 실패" },
      { status: 500 },
    );
  }

  // 점수 유효성 검증
  const axes = [parsed.axis1, parsed.axis2, parsed.axis3, parsed.axis4];
  for (const axis of axes) {
    if (!axis || typeof axis.score !== "number") {
      return Response.json(
        { error: "채점 결과 형식 오류" },
        { status: 500 },
      );
    }
  }

  const total = axes.reduce((sum, a) => sum + a.score, 0);
  parsed.totalScore = total;
  parsed.grade = getGrade(total);

  return Response.json({ score: parsed });
}
