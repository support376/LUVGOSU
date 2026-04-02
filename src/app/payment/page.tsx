"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    PaymentWidget: {
      (clientKey: string, customerKey: string): {
        renderPaymentMethods: (selector: string, amount: { value: number }) => unknown;
        renderAgreement: (selector: string) => unknown;
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

  useEffect(() => {
    if (!scriptLoaded || rendered.current) return;
    if (!("PaymentWidget" in window)) return;
    rendered.current = true;

    try {
      const widget = window.PaymentWidget(clientKey, window.PaymentWidget.ANONYMOUS);
      widget.renderPaymentMethods("#payment-method", { value: 4900 });
      widget.renderAgreement("#agreement");
      widgetRef.current = widget;

      // iframe 콘텐츠가 실제로 로드될 때까지 높이 변화 감지
      let lastHeight = 0;
      let stableCount = 0;
      const checker = setInterval(() => {
        const el = document.getElementById("payment-method");
        const iframe = el?.querySelector("iframe") as HTMLIFrameElement | null;
        if (iframe) {
          const h = iframe.offsetHeight;
          if (h > 100 && h === lastHeight) {
            stableCount++;
            // 높이가 100px 이상이고 2회 연속 같으면 로딩 완료
            if (stableCount >= 2) {
              clearInterval(checker);
              setReady(true);
            }
          } else {
            stableCount = 0;
          }
          lastHeight = h;
        }
      }, 1000);

      // 최대 30초 대기 후 강제 활성화
      setTimeout(() => {
        clearInterval(checker);
        setReady(true);
      }, 30000);
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(`위젯 초기화 실패: ${err.message || String(e)}`);
    }
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
      <main className="flex-1 flex flex-col overflow-y-auto" style={{ background: "#f5f5f5" }}>
        <div className="max-w-md mx-auto w-full px-4 py-6 space-y-6">
          {/* 헤더 */}
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-gray-900"
            >
              &larr; 뒤로
            </button>
            <h2 className="flex-1 text-center font-bold text-gray-900">결제</h2>
            <div className="w-10" />
          </div>

          {/* 상품 정보 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">💝</div>
              <div className="font-bold text-lg text-gray-900">LuvOS 시뮬레이션</div>
              <div className="text-sm text-gray-500 mt-1">AI 연애 대화 시뮬레이션 1회</div>
              <div className="text-3xl font-black mt-3" style={{ color: "#e84393" }}>4,900원</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
              <div>• 선택한 상황에서 AI와 10턴 대화</div>
              <div>• 심리학 이론 기반 4축 채점 리포트</div>
              <div>• 개선 포인트 및 대안 제시</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 break-all">
              <textarea
                readOnly
                value={error}
                className="w-full bg-transparent text-red-600 text-sm resize-none border-none focus:outline-none"
                rows={4}
              />
            </div>
          )}

          {/* 토스 결제 위젯 */}
          <div id="payment-method" style={{ minHeight: "200px", background: "#fff" }} />
          <div id="agreement" style={{ background: "#fff" }} />

          {/* 결제 버튼 */}
          <button
            onClick={handlePayment}
            disabled={!ready || loading}
            className="w-full py-4 text-white rounded-full text-lg font-bold disabled:opacity-50 transition-colors shadow-lg"
            style={{ background: ready ? "#e84393" : "#999" }}
          >
            {loading ? "결제 진행 중..." : ready ? "4,900원 결제하기" : "결제수단을 불러오는 중..."}
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
          <div className="text-gray-500">결제 페이지 로딩 중...</div>
        </main>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
