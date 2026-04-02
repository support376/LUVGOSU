"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function FailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <div className="text-center space-y-4 max-w-sm">
        <div className="text-4xl">❌</div>
        <div className="text-lg font-medium">결제 실패</div>
        <div className="text-sm text-muted">
          {message || "결제가 취소되었거나 실패했습니다."}
        </div>
        {code && (
          <div className="text-xs text-muted">오류 코드: {code}</div>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-accent text-accent rounded-full font-medium hover:bg-accent/10 transition-colors"
          >
            다시 시도
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent-light transition-colors"
          >
            홈으로
          </button>
        </div>
      </div>
    </main>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted">로딩 중...</div>
        </main>
      }
    >
      <FailContent />
    </Suspense>
  );
}
