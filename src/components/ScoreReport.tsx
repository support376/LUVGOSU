"use client";

import type { ScoreResult, Coordinate, Situation, GoalId } from "@/lib/types";
import { getDifficultyStars, getGradeColor, GOALS } from "@/lib/data";

interface Props {
  score: ScoreResult;
  coordinate: Coordinate;
  situation: Situation;
  goal: GoalId;
  onRetry: () => void;
  onHome: () => void;
}

function ScoreBar({ label, score, maxScore = 100 }: { label: string; score: number; maxScore?: number }) {
  const pct = Math.min((score / maxScore) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-accent font-medium">{score}</span>
      </div>
      <div className="w-full h-2.5 bg-card-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ScoreReport({ score, coordinate, situation, goal, onRetry, onHome }: Props) {
  const goalData = GOALS.find((g) => g.id === goal) || GOALS[0];
  const axes = [
    { label: goalData.axisLabels[0], axis: score.axis1 },
    { label: goalData.axisLabels[1], axis: score.axis2 },
    { label: goalData.axisLabels[2], axis: score.axis3 },
    { label: goalData.axisLabels[3], axis: score.axis4 },
  ];

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      {/* 헤더 */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">세션 결과 리포트</h2>
        <div className="text-sm text-muted">
          상대: ({coordinate.x},{coordinate.y}) · {situation.title} ·{" "}
          난이도 {getDifficultyStars(coordinate.x, coordinate.y)}
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-sm">
          <span>{goalData.emoji}</span>
          <span className="text-accent-light">{goalData.name}</span>
        </div>
      </div>

      {/* 등급 카드 */}
      <div className="bg-card border border-card-border rounded-2xl p-6 text-center">
        <div className={`text-6xl font-black ${getGradeColor(score.grade)}`}>
          {score.grade}
        </div>
        <div className="text-2xl font-bold mt-2">
          {score.totalScore}
          <span className="text-muted text-base font-normal">/400</span>
        </div>
      </div>

      {/* 4축 점수 */}
      <div className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
        <h3 className="font-medium text-sm text-muted">4축 분석</h3>
        {axes.map(({ label, axis }) => (
          <ScoreBar key={label} label={label} score={axis.score} />
        ))}
      </div>

      {/* 피드백 */}
      <div className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
        <h3 className="font-medium text-sm text-muted">상세 피드백</h3>
        {axes.map(({ label, axis }) => (
          <div key={label} className="text-sm">
            <div className="font-medium text-accent-light mb-1">{label}</div>
            <p className="text-muted">{axis.feedback}</p>
          </div>
        ))}
      </div>

      {/* 잘한 점 */}
      {score.bestMoment && (
        <div className="bg-green-900/20 border border-green-800/30 rounded-2xl p-5">
          <h3 className="font-medium text-green-400 text-sm mb-2">
            잘한 점 (턴 {score.bestMoment.turn})
          </h3>
          <p className="text-sm text-muted">{score.bestMoment.description}</p>
        </div>
      )}

      {/* 개선 포인트 */}
      {score.improveMoment && (
        <div className="bg-orange-900/20 border border-orange-800/30 rounded-2xl p-5">
          <h3 className="font-medium text-orange-400 text-sm mb-2">
            개선 포인트 (턴 {score.improveMoment.turn})
          </h3>
          <div className="text-sm space-y-2">
            <div>
              <span className="text-red-400 text-xs">내가 한 말:</span>
              <p className="text-muted">&ldquo;{score.improveMoment.original}&rdquo;</p>
            </div>
            <div>
              <span className="text-green-400 text-xs">이렇게 말해보세요:</span>
              <p className="text-foreground">&ldquo;{score.improveMoment.alternative}&rdquo;</p>
            </div>
          </div>
        </div>
      )}

      {/* 패턴 분석 */}
      {score.patternDetected && (
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h3 className="font-medium text-sm text-muted mb-2">감지된 패턴</h3>
          <p className="text-sm">{score.patternDetected}</p>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 py-3 border border-accent text-accent rounded-full font-medium hover:bg-accent/10 transition-colors"
        >
          다시 도전
        </button>
        <button
          onClick={onHome}
          className="flex-1 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent-light transition-colors"
        >
          홈으로
        </button>
      </div>
    </div>
  );
}
