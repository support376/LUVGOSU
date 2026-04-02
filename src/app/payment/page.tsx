"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    PaymentWidget: {
      (clientKey: string, customerKey: string): {
        renderPaymentMethods: (selector: string, amount: { value: number }) => Promise<void>;
        renderAgreement: (selector: string) => Promise<void>;
        requestPayment: (params: {
          orderId: string;
          orderName: string;
          successUrl: string;
          failUrl: string;
        }) => Promise<void>;
      };
      ANONYMOUS: string;
    };
  }
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const params = searchParams.toString();
  const [ready, setReady] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetRef = useRef<ReturnType<typeof window.PaymentWidget> | null>(null);
  const rendered = useRef(false);

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

  // 스크립트 로드 후 위젯 렌더링
  useEffect(() => {
    if (!scriptLoaded || rendered.current) return;
    if (!("PaymentWidget" in window)) return;

    rendered.current = true;

    async function renderWidgets() {
    try {
      const widget = window.PaymentWidget(clientKey, window.PaymentWidget.ANONYMOUS);
      // renderPaymentMethods는 Promise를 반환 — 완료 대기 필수
      await widget.renderPaymentMethods("#payment-method", { value: 4900 });
      await widget.renderAgreement("#agreement");
      widgetRef.current = widget;
      setReady(true);
    } catch (e: unknown) {
      let msg = "";
      try {
        msg = JSON.stringify(e, Object.getOwnPropertyNames(e as object), 2);
      } catch {
        msg = String(e);
      }
      setError(`위젯 렌더링 실패: ${msg}`);
    }
    }
    renderWidgets();
  }, [scriptLoaded, clientKey]);

  const handlePayment = async () => {
    if (!widgetRef.current) return;
    setLoading(true);
    setError(null);

    const orderId = `LUVOS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    try {
      await widgetRef.current.requestPayment({
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
      setError(err.message || String(e));
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v1/payment-widget"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
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
            <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4 text-sm text-red-400 break-all">
              <textarea
                readOnly
                value={error}
                className="w-full bg-transparent text-red-400 text-sm resize-none border-none focus:outline-none"
                rows={5}
              />
            </div>
          )}

          {/* 토스 결제 위젯 */}
          <div id="payment-method" style={{ minHeight: "200px" }} />
          <div id="agreement" />

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
