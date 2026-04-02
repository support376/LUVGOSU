import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const used = cookieStore.get("luvos_free_used");
  return Response.json({ isFree: !used });
}

// GET + SET을 원자적으로 처리: 무료면 바로 쿠키 설정하고 true 반환
export async function POST() {
  const cookieStore = await cookies();
  const used = cookieStore.get("luvos_free_used");

  if (used) {
    return Response.json({ claimed: false });
  }

  cookieStore.set("luvos_free_used", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return Response.json({ claimed: true });
}
