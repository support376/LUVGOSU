import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { paymentKey, orderId, amount } = await request.json();

  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ error: "TOSS_SECRET_KEY 미설정" }, { status: 500 });
  }

  // 금액 검증
  if (amount !== 4_900) {
    return Response.json({ error: "잘못된 금액" }, { status: 400 });
  }

  // 토스 결제 승인 API 호출
  const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const data = await res.json();

  if (!res.ok) {
    return Response.json(
      { error: data.message || "결제 승인 실패" },
      { status: res.status },
    );
  }

  // 결제 성공 → 세션 쿠키 설정 (이 결제로 1회 시뮬레이션 가능)
  const cookieStore = await cookies();
  cookieStore.set("luvos_paid", orderId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2시간 유효
    path: "/",
  });

  return Response.json({ success: true, orderId });
}
