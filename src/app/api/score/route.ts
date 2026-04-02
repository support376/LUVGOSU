import { buildScoringPrompt } from "@/lib/prompts";
import { SITUATIONS } from "@/lib/data";
import type { Coordinate, ChatMessage, ScoreResult } from "@/lib/types";
import { getGrade } from "@/lib/data";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    coordinate,
    situationId,
    messages,
  }: {
    coordinate: Coordinate;
    situationId: string;
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

  const scoringPrompt = buildScoringPrompt(messages, coordinate, situation);

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

  // JSON 파싱
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return Response.json(
      { error: "채점 결과 파싱 실패" },
      { status: 500 },
    );
  }

  const parsed = JSON.parse(jsonMatch[0]) as ScoreResult;

  // totalScore 재계산
  const total =
    parsed.toxinAvoidance.score +
    parsed.positiveRatio.score +
    parsed.repairAttempts.score +
    parsed.acceptingInfluence.score;
  parsed.totalScore = total;
  parsed.grade = getGrade(total);

  return Response.json({ score: parsed });
}
