"use client";

import type { GoalId } from "@/lib/types";
import { GOALS } from "@/lib/data";

interface Props {
  value: GoalId | null;
  onChange: (goalId: GoalId) => void;
}

export default function GoalPicker({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm text-muted">관계 목표 선택</h3>
      <p className="text-xs text-muted">이 대화에서 무엇을 달성하고 싶나요? 목표에 따라 채점 기준이 달라집니다.</p>
      {GOALS.map((goal) => (
        <button
          key={goal.id}
          onClick={() => onChange(goal.id)}
          className={`w-full text-left p-4 rounded-xl border transition-all ${
            value === goal.id
              ? "border-accent bg-accent/10"
              : "border-card-border bg-card hover:border-accent/50"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{goal.emoji}</span>
            <span className="font-medium">{goal.name}</span>
          </div>
          <p className="text-sm text-muted">{goal.description}</p>
          {goal.warning && (
            <p className="text-xs text-orange-400 mt-2">{goal.warning}</p>
          )}
          {value === goal.id && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {goal.axisLabels.map((label, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 bg-accent/20 text-accent-light rounded-full"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
