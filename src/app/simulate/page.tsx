"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatUI from "@/components/ChatUI";
import ScoreReport from "@/components/ScoreReport";
import { SITUATIONS, GOALS } from "@/lib/data";
import type { Coordinate, ChatMessage, ScoreResult, GoalId, Gender, ConflictRole } from "@/lib/types";

function SimulateContent() {
  const searchParams = useSearchParams();
  const x = parseInt(searchParams.get("x") || "3");
  const y = parseInt(searchParams.get("y") || "3");
  const situationId = searchParams.get("s") || "S1";
  const goalId = (searchParams.get("g") || "reconciliation") as GoalId;
  const myGender = (searchParams.get("mg") || "male") as Gender;
  const opponentGender = (searchParams.get("og") || "female") as Gender;
  const role = (searchParams.get("r") || "upset") as ConflictRole;

  const coordinate: Coordinate = { x, y };
  const situation = SITUATIONS.find((s) => s.id === situationId) || SITUATIONS[0];
  const goalData = GOALS.find((g) => g.id === goalId) || GOALS[0];

  const [phase, setPhase] = useState<"chat" | "scoring" | "report">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [score, setScore] = useState<ScoreResult | null>(null);

  const handleComplete = async (completedMessages: ChatMessage[]) => {
    setMessages(completedMessages);
    setPhase("scoring");

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coordinate,
          situationId,
          goal: goalId,
          myGender,
          opponentGender,
          role,
          messages: completedMessages,
        }),
      });

      const data = await res.json();
      if (data.score) {
        setScore(data.score);
        setPhase("report");
      } else {
        alert("채점 중 오류가 발생했습니다: " + (data.error || "알 수 없는 오류"));
        setPhase("chat");
      }
    } catch {
      alert("채점 요청 중 오류가 발생했습니다.");
      setPhase("chat");
    }
  };

  if (phase === "scoring") {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-pulse">{goalData.emoji}</div>
          <div className="text-lg font-medium">{goalData.name} 목표 기반 분석 중...</div>
          <div className="text-sm text-muted">
            {goalData.axisLabels.join(" · ")}
          </div>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-accent rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (phase === "report" && score) {
    return (
      <main className="flex-1 overflow-y-auto py-6">
        <ScoreReport
          score={score}
          coordinate={coordinate}
          situation={situation}
          goal={goalId}
          onRetry={() => {
            setPhase("chat");
            setMessages([]);
            setScore(null);
          }}
          onHome={() => (window.location.href = "/")}
        />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <ChatUI
        coordinate={coordinate}
        situation={situation}
        goal={goalId}
        myGender={myGender}
        opponentGender={opponentGender}
        role={role}
        onComplete={handleComplete}
      />
    </main>
  );
}

export default function SimulatePage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted">로딩 중...</div>
        </main>
      }
    >
      <SimulateContent />
    </Suspense>
  );
}
