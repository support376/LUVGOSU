"use client";

import { useState } from "react";
import CoordinateGrid from "@/components/CoordinateGrid";
import ProfileSetup from "@/components/ProfileSetup";
import GoalPicker from "@/components/GoalPicker";
import SituationPicker from "@/components/SituationPicker";
import type { Coordinate, GoalId, Gender, ConflictRole } from "@/lib/types";
import { getDifficultyStars, GOALS } from "@/lib/data";

type Step = "landing" | "profile" | "coordinate" | "goal" | "situation";

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [myGender, setMyGender] = useState<Gender | null>(null);
  const [opponentGender, setOpponentGender] = useState<Gender | null>(null);
  const [role, setRole] = useState<ConflictRole | null>(null);
  const [coordinate, setCoordinate] = useState<Coordinate>({ x: 3, y: 3 });
  const [goal, setGoal] = useState<GoalId | null>(null);
  const [situationId, setSituationId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const genderLabel = (g: Gender | null) => g === "male" ? "남자" : g === "female" ? "여자" : "";
  const roleLabel = role === "upset" ? "😤 문제 제기" : role === "accused" ? "😰 지적당하는 쪽" : "";

  // 랜딩 페이지
  if (step === "landing") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center overflow-y-auto">
        <div className="max-w-md space-y-8">
          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tight">
              Luv<span className="text-accent">OS</span>
            </h1>
            <p className="text-lg text-muted">연애력을 데이터로 만든다</p>
          </div>

          <div className="space-y-4 text-sm text-muted">
            <div className="bg-card border border-card-border rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">1</span>
                <div>
                  <div className="text-foreground font-medium">프로필 설정</div>
                  <div>나와 상대의 성별 · 갈등에서의 역할</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">2</span>
                <div>
                  <div className="text-foreground font-medium">상대 유형 + 목표</div>
                  <div>5x5 좌표 성격 · 화해/주도권/진심/정리</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">3</span>
                <div>
                  <div className="text-foreground font-medium">갈등 시뮬레이션</div>
                  <div>AI 상대와 카톡 스타일 10턴 대화</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">4</span>
                <div>
                  <div className="text-foreground font-medium">목표 기반 채점</div>
                  <div>심리학 이론 4축 분석 리포트</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep("profile")}
            className="w-full py-4 bg-accent text-white rounded-full text-lg font-bold hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
          >
            시작하기
          </button>
          <p className="text-xs text-muted">무료 체험</p>
        </div>
      </main>
    );
  }

  // 프로필 설정
  if (step === "profile") {
    const profileComplete = myGender && opponentGender && role;
    return (
      <main className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 py-6 overflow-y-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => setStep("landing")} className="text-muted hover:text-foreground">
            &larr; 뒤로
          </button>
          <h2 className="flex-1 text-center font-bold">프로필 설정</h2>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto">
          <ProfileSetup
            myGender={myGender}
            opponentGender={opponentGender}
            role={role}
            onMyGenderChange={setMyGender}
            onOpponentGenderChange={setOpponentGender}
            onRoleChange={setRole}
          />
        </div>

        <button
          onClick={() => setStep("coordinate")}
          disabled={!profileComplete}
          className="mt-4 w-full py-3 bg-accent text-white rounded-full font-medium disabled:opacity-50 hover:bg-accent-light transition-colors"
        >
          다음: 상대 유형 설정
        </button>
      </main>
    );
  }

  // 좌표 설정
  if (step === "coordinate") {
    return (
      <main className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 py-6 overflow-y-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => setStep("profile")} className="text-muted hover:text-foreground">
            &larr; 뒤로
          </button>
          <h2 className="flex-1 text-center font-bold">상대 유형 설정</h2>
          <div className="w-10" />
        </div>

        <div className="mb-3 text-sm text-center text-muted">
          나({genderLabel(myGender)}) vs 상대({genderLabel(opponentGender)}) · {roleLabel}
        </div>

        <div className="flex-1 overflow-y-auto">
          <CoordinateGrid value={coordinate} onChange={setCoordinate} />
        </div>

        <button
          onClick={() => setStep("goal")}
          className="mt-4 w-full py-3 bg-accent text-white rounded-full font-medium hover:bg-accent-light transition-colors"
        >
          다음: 목표 선택
        </button>
      </main>
    );
  }

  // 목표 선택
  if (step === "goal") {
    return (
      <main className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 py-6 overflow-y-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => setStep("coordinate")} className="text-muted hover:text-foreground">
            &larr; 뒤로
          </button>
          <h2 className="flex-1 text-center font-bold">관계 목표 선택</h2>
          <div className="w-10" />
        </div>

        <div className="mb-3 text-sm text-center text-muted">
          상대: ({coordinate.x},{coordinate.y}) · 난이도 {getDifficultyStars(coordinate.x, coordinate.y)}
        </div>

        <div className="flex-1 overflow-y-auto">
          <GoalPicker value={goal} onChange={setGoal} />
        </div>

        <button
          onClick={() => setStep("situation")}
          disabled={!goal}
          className="mt-4 w-full py-3 bg-accent text-white rounded-full font-medium disabled:opacity-50 hover:bg-accent-light transition-colors"
        >
          다음: 상황 선택
        </button>
      </main>
    );
  }

  // 상황 선택
  const selectedGoal = goal ? GOALS.find((g) => g.id === goal) : null;
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-md mx-auto w-full px-4 py-6">
        <div className="flex items-center mb-6">
          <button onClick={() => setStep("goal")} className="text-muted hover:text-foreground">
            &larr; 뒤로
          </button>
          <h2 className="flex-1 text-center font-bold">상황 선택</h2>
          <div className="w-10" />
        </div>

        <div className="mb-3 text-sm text-center text-muted">
          상대: ({coordinate.x},{coordinate.y}) · {roleLabel}
          {selectedGoal && (
            <span> · {selectedGoal.emoji} {selectedGoal.name}</span>
          )}
        </div>

        <SituationPicker value={situationId} onChange={setSituationId} role={role!} />

        <button
        onClick={async () => {
          if (!situationId || !goal || !myGender || !opponentGender || !role || starting) return;
          setStarting(true);
          const simParams = `x=${coordinate.x}&y=${coordinate.y}&s=${situationId}&g=${goal}&mg=${myGender}&og=${opponentGender}&r=${role}`;

          try {
            // 무료 1회 원자적 체크+소비
            const res = await fetch("/api/check-free", { method: "POST" });
            const { claimed } = await res.json();

            if (claimed) {
              window.location.href = `/simulate?${simParams}`;
              return;
            }

            // 이미 결제한 세션 확인
            const paidRes = await fetch("/api/check-paid");
            const { isPaid } = await paidRes.json();
            if (isPaid) {
              window.location.href = `/simulate?${simParams}`;
            } else {
              window.location.href = `/payment?${simParams}`;
            }
          } catch {
            setStarting(false);
          }
        }}
        disabled={!situationId || starting}
        className="mt-4 w-full py-3 bg-accent text-white rounded-full font-medium disabled:opacity-50 hover:bg-accent-light transition-colors"
      >
        {starting ? "준비 중..." : "시뮬레이션 시작"}
        </button>
      </div>
    </main>
  );
}
