"use client";

import type { ConflictRole } from "@/lib/types";
import { SITUATIONS } from "@/lib/data";

interface Props {
  value: string | null;
  onChange: (situationId: string) => void;
  role: ConflictRole;
}

const categoryIcons: Record<string, string> = {
  "연락/답장": "📱",
  "약속/계획": "📅",
  "외부 관계": "👥",
  "감정 표현": "💔",
  "미래/진지함": "💍",
  "돈/경제": "💰",
  "잠자리": "🛏️",
  "가족": "👨‍👩‍👦",
  "전 애인": "👻",
  "생활습관": "🏠",
  "신뢰": "🔓",
  "결혼/동거": "💒",
  "외모/자존감": "🪞",
  "커리어": "💼",
};

export default function SituationPicker({ value, onChange, role }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm text-muted">갈등 상황 선택</h3>
      {SITUATIONS.map((situation) => {
        const setup = role === "accused" ? situation.setupAccused : situation.setup;
        return (
          <button
            key={situation.id}
            onClick={() => onChange(situation.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              value === situation.id
                ? "border-accent bg-accent/10"
                : "border-card-border bg-card hover:border-accent/50"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">
                {categoryIcons[situation.category] || "💬"}
              </span>
              <span className="font-medium">{situation.title}</span>
              <span className="text-xs text-muted ml-auto">
                {situation.category}
              </span>
            </div>
            <p className="text-sm text-muted">{setup}</p>
          </button>
        );
      })}
    </div>
  );
}
