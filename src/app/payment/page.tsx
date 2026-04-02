"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      requestPayment: (
        method: string,
        params: {
          amount: number;
          orderId: string;
          orderName: string;
          successUrl: string;
          failUrl: string;
        },
      ) => Promise<void>;
    };
  }
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const params = searchParams.toString();
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

  useEffect(() => {
    if (typeof window !== "undefined" && "TossPayments" in window) {
      setSdkReady(true);
    }
  }, []);

  const handlePayment = async () => {
    if (!window.TossPayments) {
      setError("결제 모듈이 로딩되지 않았습니다. 페이지를 새로고침해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    const orderId = `LUVOS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    try {
      setError(`디버그: key=${clientKey.substring(0, 12)}... orderId=${orderId} origin=${window.location.origin}`);
      const tossPayments = window.TossPayments(clientKey);
      await tossPayments.requestPayment("카드", {
        amount: 4900,
        orderId,
        orderName: "LuvOS 시뮬레이션 1회",
        successUrl: `${window.location.origin}/payment/success?${params}`,
        failUrl: `${window.location.origin}/payment/fail?${params}`,
      });
    } catch (e: unknown) {
      console.error("TOSS ERROR FULL:", e);
      const err = e as Record<string, unknown>;
      if (err.code === "USER_CANCEL" || err.code === "PAY_PROCESS_CANCELED") {
        setLoading(false);
        setError(null);
        return;
      }
      // 전체 에러 객체를 다 보여줌
      let msg = "";
      try {
        msg = JSON.stringify(e, Object.getOwnPropertyNames(e as object), 2);
      } catch {
        msg = String(e);
      }
      setError(`에러 전체: ${msg}`);
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v1/payment"
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
        onError={() => setError("토스 결제 스크립트 로딩 실패")}
      />
      <main className="flex-1 flex flex-col overflow-y-auto bg-background">
        <div className="max-w-md mx-auto w-full px-4 py-6 space-y-6">
          {/* 헤더 */}
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="text-muted hover:text-foreground"
            >
              &larr; 뒤로
            </button>
            <h2 className="flex-1 text-center font-bold">결제</h2>
            <div className="w-10" />
          </div>

          {/* 상품 정보 */}
          <div className="bg-card border border-card-border rounded-2xl p-5">
            <div className="text-center">
              <div className="text-2xl mb-2">💝</div>
              <div className="font-bold text-lg">LuvOS 시뮬레이션</div>
              <div className="text-sm text-muted mt-1">AI 연애 대화 시뮬레이션 1회</div>
              <div className="text-3xl font-black text-accent mt-3">4,900원</div>
            </div>
            <div className="mt-4 pt-4 border-t border-card-border text-xs text-muted space-y-1">
              <div>• 선택한 상황에서 AI와 10턴 대화</div>
              <div>• 심리학 이론 기반 4축 채점 리포트</div>
              <div>• 개선 포인트 및 대안 제시</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4 text-sm text-red-400 text-center break-all">
              {error}
            </div>
          )}

          {/* 결제 버튼 */}
          <button
            onClick={handlePayment}
            disabled={!sdkReady || loading}
            className="w-full py-4 bg-accent text-white rounded-full text-lg font-bold disabled:opacity-50 hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
          >
            {loading ? "결제 진행 중..." : sdkReady ? "4,900원 카드 결제" : "결제 모듈 로딩 중..."}
          </button>
        </div>
      </main>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted">결제 페이지 로딩 중...</div>
        </main>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
