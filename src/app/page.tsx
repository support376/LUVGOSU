"use client";

import { useState } from "react";
import CoordinateGrid from "@/components/CoordinateGrid";
import SituationPicker from "@/components/SituationPicker";
import type { Coordinate } from "@/lib/types";
import { getDifficultyStars } from "@/lib/data";

type Step = "landing" | "coordinate" | "situation";

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [coordinate, setCoordinate] = useState<Coordinate>({ x: 3, y: 3 });
  const [situationId, setSituationId] = useState<string | null>(null);

  // 랜딩 페이지
  if (step === "landing") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md space-y-8">
          {/* 로고 & 타이틀 */}
          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tight">
              Luv<span className="text-accent">OS</span>
            </h1>
            <p className="text-lg text-muted">연애력을 데이터로 만든다</p>
          </div>

          {/* 설명 */}
          <div className="space-y-4 text-sm text-muted">
            <div className="bg-card border border-card-border rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">1</span>
                <div>
                  <div className="text-foreground font-medium">상대 유형 설정</div>
                  <div>5x5 좌표에서 상대의 성격을 선택</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">2</span>
                <div>
                  <div className="text-foreground font-medium">갈등 시뮬레이션</div>
                  <div>AI 상대와 10턴 대화</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">3</span>
                <div>
                  <div className="text-foreground font-medium">연구 기반 채점</div>
                  <div>Gottman Method 4축 분석 리포트</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => setStep("coordinate")}
            className="w-full py-4 bg-accent text-white rounded-full text-lg font-bold hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
          >
            시작하기
          </button>
          <p className="text-xs text-muted">무료 1회 체험</p>
        </div>
      </main>
    );
  }

  // 좌표 설정 단계
  if (step === "coordinate") {
    return (
      <main className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 py-6">
        <div className="flex items-center mb-6">
          <button onClick={() => setStep("landing")} className="text-muted hover:text-foreground">
            &larr; 뒤로
          </button>
          <h2 className="flex-1 text-center font-bold">상대 유형 설정</h2>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto">
          <CoordinateGrid value={coordinate} onChange={setCoordinate} />
        </div>

        <button
          onClick={() => setStep("situation")}
          className="mt-4 w-full py-3 bg-accent text-white rounded-full font-medium hover:bg-accent-light transition-colors"
        >
          다음: 상황 선택
        </button>
      </main>
    );
  }

  // 상황 선택 단계
  return (
    <main className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 py-6">
      <div className="flex items-center mb-6">
        <button onClick={() => setStep("coordinate")} className="text-muted hover:text-foreground">
          &larr; 뒤로
        </button>
        <h2 className="flex-1 text-center font-bold">상황 선택</h2>
        <div className="w-10" />
      </div>

      <div className="mb-3 text-sm text-center text-muted">
        상대: ({coordinate.x},{coordinate.y}) · 난이도{" "}
        {getDifficultyStars(coordinate.x, coordinate.y)}
      </div>

      <div className="flex-1 overflow-y-auto">
        <SituationPicker value={situationId} onChange={setSituationId} />
      </div>

      <button
        onClick={() => {
          if (situationId) {
            window.location.href = `/simulate?x=${coordinate.x}&y=${coordinate.y}&s=${situationId}`;
          }
        }}
        disabled={!situationId}
        className="mt-4 w-full py-3 bg-accent text-white rounded-full font-medium disabled:opacity-50 hover:bg-accent-light transition-colors"
      >
        시뮬레이션 시작
      </button>
    </main>
  );
}
