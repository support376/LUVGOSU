export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

  // 시뮬레이션 파라미터 복원
  let simParams = "";
  for (const k of ["x", "y", "s", "g", "mg", "og", "r"]) {
    const v = params.get(k);
    if (v) simParams += `&${k}=${encodeURIComponent(v)}`;
  }
  if (simParams) simParams = simParams.slice(1);

  const origin = url.origin;

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LuvOS 결제</title>
  <script src="https://js.tosspayments.com/v1/payment-widget"><\/script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;color:#1a1a1a}
    .wrap{max-width:480px;margin:0 auto;padding:20px}
    .card{background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,.08);text-align:center}
    .price{font-size:32px;font-weight:900;color:#e84393;margin-top:8px}
    .sub{font-size:13px;color:#888;margin-top:4px}
    #payment-method{margin-bottom:12px}
    #agreement{margin-bottom:12px}
    .pay-btn{width:100%;padding:16px;font-size:17px;font-weight:700;color:#fff;background:#ccc;border:none;border-radius:50px;cursor:pointer}
    .pay-btn.active{background:#e84393}
    .back{display:inline-block;color:#888;text-decoration:none;font-size:14px;margin-bottom:16px}
    .error{background:#fff0f0;border:1px solid #ffccc7;border-radius:12px;padding:12px;font-size:13px;color:#e84393;margin-bottom:16px;word-break:break-all;display:none}
  </style>
</head>
<body>
  <div class="wrap">
    <a class="back" href="javascript:history.back();">&larr; 뒤로</a>
    <div class="card">
      <div style="font-size:28px">💝</div>
      <div style="font-size:18px;font-weight:700">LuvOS 시뮬레이션 1회</div>
      <div class="price">4,900원</div>
      <div class="sub">카드 · 카카오페이 · 네이버페이 등</div>
    </div>
    <div id="error-box" class="error"></div>
    <div id="payment-method"></div>
    <div id="agreement"></div>
    <button id="pay-btn" class="pay-btn" disabled>결제수단을 불러오는 중...</button>
  </div>
  <script>
    var widget;
    try {
      widget = PaymentWidget('${clientKey}', PaymentWidget.ANONYMOUS);
      widget.renderPaymentMethods('#payment-method', { value: 4900 });
      widget.renderAgreement('#agreement');
    } catch(e) {
      document.getElementById('error-box').textContent = '초기화 실패: ' + e.message;
      document.getElementById('error-box').style.display = 'block';
    }

    var startTime = Date.now();
    var checker = setInterval(function() {
      var iframe = document.querySelector('#payment-method iframe');
      var elapsed = Math.round((Date.now() - startTime) / 1000);
      if (iframe && iframe.offsetHeight > 200) {
        clearInterval(checker);
        setTimeout(function() {
          var btn = document.getElementById('pay-btn');
          btn.textContent = '4,900원 결제하기';
          btn.classList.add('active');
          btn.disabled = false;
        }, 3000);
      }
      if (elapsed >= 25) {
        clearInterval(checker);
        var btn2 = document.getElementById('pay-btn');
        btn2.textContent = '4,900원 결제하기';
        btn2.classList.add('active');
        btn2.disabled = false;
      }
    }, 1000);

    document.getElementById('pay-btn').addEventListener('click', function() {
      if (!widget) return;
      var btn = this;
      btn.disabled = true;
      btn.textContent = '결제 진행 중...';
      widget.requestPayment({
        orderId: 'LUVOS-' + Date.now() + '-' + Math.random().toString(36).slice(2,8),
        orderName: 'LuvOS 시뮬레이션 1회',
        successUrl: '${origin}/payment/success?${simParams}',
        failUrl: '${origin}/payment/fail?${simParams}',
      }).catch(function(err) {
        if (err.code === 'USER_CANCEL' || err.code === 'PAY_PROCESS_CANCELED') {
          btn.disabled = false;
          btn.textContent = '4,900원 결제하기';
          return;
        }
        document.getElementById('error-box').textContent = err.message || String(err);
        document.getElementById('error-box').style.display = 'block';
        btn.disabled = false;
        btn.textContent = '4,900원 결제하기';
      });
    });
  <\/script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
