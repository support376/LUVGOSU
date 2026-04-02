"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = parseInt(searchParams.get("amount") || "0");

  // 시뮬레이션 파라미터 복원
  const x = searchParams.get("x");
  const y = searchParams.get("y");
  const s = searchParams.get("s");
  const g = searchParams.get("g");
  const mg = searchParams.get("mg");
  const og = searchParams.get("og");
  const r = searchParams.get("r");

  const [status, setStatus] = useState<"confirming" | "success" | "error">("confirming");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function confirm() {
      if (!paymentKey || !orderId) {
        setStatus("error");
        setErrorMsg("결제 정보가 올바르지 않습니다.");
        return;
      }

      try {
        const res = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        });

        const data = await res.json();
        if (data.success) {
          setStatus("success");
          setTimeout(() => {
            window.location.href = `/simulate?x=${x}&y=${y}&s=${s}&g=${g}&mg=${mg}&og=${og}&r=${r}`;
          }, 1500);
        } else {
          setStatus("error");
          setErrorMsg(data.error || "결제 승인에 실패했습니다.");
        }
      } catch {
        setStatus("error");
        setErrorMsg("결제 승인 요청 중 오류가 발생했습니다.");
      }
    }

    confirm();
  }, [paymentKey, orderId, amount, x, y, s, g, mg, og, r]);

  if (status === "confirming") {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-pulse">💳</div>
          <div className="text-lg font-medium">결제 승인 중...</div>
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

  if (status === "error") {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="text-4xl">❌</div>
          <div className="text-lg font-medium">결제 실패</div>
          <div className="text-sm text-muted">{errorMsg}</div>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent-light transition-colors"
          >
            다시 시도
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-4xl">✅</div>
        <div className="text-lg font-medium">결제 완료!</div>
        <div className="text-sm text-muted">시뮬레이션으로 이동합니다...</div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted">로딩 중...</div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
