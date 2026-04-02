import { cookies } from "next/headers";

// 크레딧 조회
export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("luvos_credits")?.value;

  // 최초 방문: 무료 1회 부여
  if (raw === undefined) {
    cookieStore.set("luvos_credits", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return Response.json({ credits: 1 });
  }

  return Response.json({ credits: parseInt(raw) || 0 });
}

// 크레딧 사용 (1 차감)
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const { action, amount } = await request.json() as { action: string; amount?: number };

  const current = parseInt(cookieStore.get("luvos_credits")?.value || "0");

  let newCredits = current;

  if (action === "use") {
    if (current <= 0) {
      return Response.json({ success: false, credits: 0, error: "크레딧 부족" });
    }
    newCredits = current - 1;
  } else if (action === "add" && amount) {
    newCredits = current + amount;
  }

  cookieStore.set("luvos_credits", String(newCredits), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return Response.json({ success: true, credits: newCredits });
}
