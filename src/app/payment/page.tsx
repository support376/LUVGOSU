"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

function PaymentContent() {
  const searchParams = useSearchParams();
  const params = searchParams.toString();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetsRef = useRef<ReturnType<Awaited<ReturnType<typeof loadTossPayments>>["widgets"]> | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function init() {
      try {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!clientKey) {
          setError("결제 키가 설정되지 않았습니다.");
          return;
        }

        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

        await widgets.setAmount({ currency: "KRW", value: 4900 });

        await widgets.renderPaymentMethods({
          selector: "#payment-method",
        });

        await widgets.renderAgreement({
          selector: "#agreement",
        });

        widgetsRef.current = widgets;
        setReady(true);
      } catch (e: unknown) {
        console.error("Widget init error:", e);
        let msg = "";
        try {
          msg = JSON.stringify(e, Object.getOwnPropertyNames(e as object), 2);
        } catch {
          msg = String(e);
        }
        setError(`위젯 로딩 실패: ${msg}`);
      }
    }

    init();
  }, []);

  const handlePayment = async () => {
    if (!widgetsRef.current) return;
    setLoading(true);
    setError(null);

    const orderId = `LUVOS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    try {
      await widgetsRef.current.requestPayment({
        orderId,
        orderName: "LuvOS 시뮬레이션 1회",
        successUrl: `${window.location.origin}/payment/success?${params}`,
        failUrl: `${window.location.origin}/payment/fail?${params}`,
      });
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      if (err.code === "USER_CANCEL" || err.code === "PAY_PROCESS_CANCELED") {
        setLoading(false);
        return;
      }
      setError(err.message || `결제 오류: ${String(e)}`);
      setLoading(false);
    }
  };

  return (
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

        {/* 토스 결제 위젯 */}
        <div id="payment-method" className="rounded-xl overflow-hidden" />
        <div id="agreement" className="rounded-xl overflow-hidden" />

        {/* 결제 버튼 */}
        <button
          onClick={handlePayment}
          disabled={!ready || loading}
          className="w-full py-4 bg-accent text-white rounded-full text-lg font-bold disabled:opacity-50 hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
        >
          {loading ? "결제 진행 중..." : ready ? "4,900원 결제하기" : "결제 모듈 로딩 중..."}
        </button>
      </div>
    </main>
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
