import { buildSimulationSystemPrompt } from "@/lib/prompts";
import { SITUATIONS } from "@/lib/data";
import type { Coordinate, ChatMessage } from "@/lib/types";

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

  const systemPrompt = buildSimulationSystemPrompt(coordinate, situation);

  // Claude API 메시지 형식으로 변환
  const apiMessages = messages.map((m) => ({
    role: m.role === "user" ? ("user" as const) : ("assistant" as const),
    content: m.content,
  }));

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: systemPrompt,
      messages: apiMessages,
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
  const reply =
    data.content?.[0]?.type === "text" ? data.content[0].text : "";

  return Response.json({ reply });
}
