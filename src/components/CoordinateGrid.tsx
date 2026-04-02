"use client";

import { useState } from "react";
import type { Coordinate, TypePreset } from "@/lib/types";
import { TYPE_PRESETS } from "@/lib/data";

interface Props {
  value: Coordinate;
  onChange: (coord: Coordinate) => void;
}

export default function CoordinateGrid({ value, onChange }: Props) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handlePreset = (preset: TypePreset) => {
    setSelectedPreset(preset.id);
    onChange(preset.coordinate);
  };

  const handleGridClick = (x: number, y: number) => {
    setSelectedPreset(null);
    onChange({ x, y });
  };

  return (
    <div className="space-y-6">
      {/* 프리셋 선택 */}
      <div>
        <h3 className="text-sm text-muted mb-3">대표 유형 선택</h3>
        <div className="grid grid-cols-3 gap-2">
          {TYPE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePreset(preset)}
              className={`p-3 rounded-xl text-left transition-all border ${
                selectedPreset === preset.id
                  ? "border-accent bg-accent/10"
                  : "border-card-border bg-card hover:border-accent/50"
              }`}
            >
              <div className="text-lg mb-1">{preset.emoji} {preset.name}</div>
              <div className="text-xs text-muted">{preset.oneLiner}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 5x5 그리드 */}
      <div>
        <h3 className="text-sm text-muted mb-3">직접 좌표 선택 (또는 미세 조정)</h3>
        <div className="relative">
          {/* Y축 라벨 */}
          <div className="flex items-center mb-1">
            <span className="text-xs text-muted w-16"></span>
            <div className="flex-1 text-center text-xs text-accent-light">감정 폭발</div>
          </div>

          <div className="flex">
            {/* X축 라벨 (좌) */}
            <div className="flex flex-col justify-center w-16">
              <span className="text-xs text-accent-light text-right pr-2">집착</span>
            </div>

            {/* 그리드 본체 */}
            <div className="flex-1">
              <div className="grid grid-cols-5 gap-1">
                {/* y는 5(상단)부터 1(하단)으로 */}
                {[5, 4, 3, 2, 1].map((y) =>
                  [1, 2, 3, 4, 5].map((x) => {
                    const isSelected = value.x === x && value.y === y;
                    const preset = TYPE_PRESETS.find(
                      (p) => p.coordinate.x === x && p.coordinate.y === y,
                    );
                    return (
                      <button
                        key={`${x}-${y}`}
                        onClick={() => handleGridClick(x, y)}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all ${
                          isSelected
                            ? "bg-accent text-white scale-110 shadow-lg shadow-accent/30"
                            : preset
                              ? "bg-card-border/50 hover:bg-accent/30"
                              : "bg-card hover:bg-card-border"
                        }`}
                        title={preset ? `${preset.name} (${x},${y})` : `(${x},${y})`}
                      >
                        {isSelected ? "●" : preset ? preset.emoji : "·"}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>

            {/* X축 라벨 (우) */}
            <div className="flex flex-col justify-center w-16">
              <span className="text-xs text-accent-light pl-2">회피</span>
            </div>
          </div>

          <div className="flex items-center mt-1">
            <span className="text-xs text-muted w-16"></span>
            <div className="flex-1 text-center text-xs text-accent-light">감정 억제</div>
          </div>
        </div>
      </div>

      {/* 현재 선택 표시 */}
      <div className="bg-card border border-card-border rounded-xl p-4 text-center">
        <div className="text-sm text-muted mb-1">선택된 좌표</div>
        <div className="text-2xl font-bold text-accent">
          ({value.x}, {value.y})
        </div>
        <div className="text-sm text-muted mt-1">
          {value.x <= 2 ? "집착" : value.x >= 4 ? "회피" : "중간"}
          {" · "}
          {value.y <= 2 ? "억제" : value.y >= 4 ? "폭발" : "중간"}
        </div>
      </div>
    </div>
  );
}
