import { cookies } from "next/headers";

const PLANS: Record<number, number> = {
  4900: 1,   // 1회권
  17900: 5,  // 5회권
};

export async function POST(request: Request) {
  const { paymentKey, orderId, amount } = await request.json();

  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ error: "TOSS_SECRET_KEY 미설정" }, { status: 500 });
  }

  // 금액 검증
  const creditsToAdd = PLANS[amount];
  if (!creditsToAdd) {
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

  // 결제 성공 → 크레딧 추가
  const cookieStore = await cookies();
  const current = parseInt(cookieStore.get("luvos_credits")?.value || "0");
  const newCredits = current + creditsToAdd;

  cookieStore.set("luvos_credits", String(newCredits), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return Response.json({ success: true, credits: newCredits, added: creditsToAdd });
}
