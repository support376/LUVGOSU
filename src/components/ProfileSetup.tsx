"use client";

import type { Gender, ConflictRole } from "@/lib/types";

interface Props {
  myGender: Gender | null;
  opponentGender: Gender | null;
  role: ConflictRole | null;
  onMyGenderChange: (g: Gender) => void;
  onOpponentGenderChange: (g: Gender) => void;
  onRoleChange: (r: ConflictRole) => void;
}

export default function ProfileSetup({
  myGender,
  opponentGender,
  role,
  onMyGenderChange,
  onOpponentGenderChange,
  onRoleChange,
}: Props) {
  return (
    <div className="space-y-6">
      {/* 내 성별 */}
      <div>
        <h3 className="text-sm text-muted mb-3">나의 성별</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onMyGenderChange("male")}
            className={`p-4 rounded-xl border text-center transition-all ${
              myGender === "male"
                ? "border-accent bg-accent/10"
                : "border-card-border bg-card hover:border-accent/50"
            }`}
          >
            <div className="text-2xl mb-1">👨</div>
            <div className="text-sm font-medium">남자</div>
          </button>
          <button
            onClick={() => onMyGenderChange("female")}
            className={`p-4 rounded-xl border text-center transition-all ${
              myGender === "female"
                ? "border-accent bg-accent/10"
                : "border-card-border bg-card hover:border-accent/50"
            }`}
          >
            <div className="text-2xl mb-1">👩</div>
            <div className="text-sm font-medium">여자</div>
          </button>
        </div>
      </div>

      {/* 상대 성별 */}
      <div>
        <h3 className="text-sm text-muted mb-3">상대의 성별</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onOpponentGenderChange("male")}
            className={`p-4 rounded-xl border text-center transition-all ${
              opponentGender === "male"
                ? "border-accent bg-accent/10"
                : "border-card-border bg-card hover:border-accent/50"
            }`}
          >
            <div className="text-2xl mb-1">👨</div>
            <div className="text-sm font-medium">남자</div>
          </button>
          <button
            onClick={() => onOpponentGenderChange("female")}
            className={`p-4 rounded-xl border text-center transition-all ${
              opponentGender === "female"
                ? "border-accent bg-accent/10"
                : "border-card-border bg-card hover:border-accent/50"
            }`}
          >
            <div className="text-2xl mb-1">👩</div>
            <div className="text-sm font-medium">여자</div>
          </button>
        </div>
      </div>

      {/* 갈등에서 내 역할 */}
      <div>
        <h3 className="text-sm text-muted mb-3">이 갈등에서 나의 역할</h3>
        <div className="space-y-3">
          <button
            onClick={() => onRoleChange("upset")}
            className={`w-full p-4 rounded-xl border text-left transition-all ${
              role === "upset"
                ? "border-accent bg-accent/10"
                : "border-card-border bg-card hover:border-accent/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">😤</span>
              <div>
                <div className="font-medium">내가 문제 제기</div>
                <div className="text-xs text-muted">상대가 잘못한 상황. 내가 따지는 쪽</div>
              </div>
            </div>
          </button>
          <button
            onClick={() => onRoleChange("accused")}
            className={`w-full p-4 rounded-xl border text-left transition-all ${
              role === "accused"
                ? "border-accent bg-accent/10"
                : "border-card-border bg-card hover:border-accent/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">😰</span>
              <div>
                <div className="font-medium">내가 지적당하는 쪽</div>
                <div className="text-xs text-muted">내가 잘못한 상황. 상대가 따지는 쪽</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
