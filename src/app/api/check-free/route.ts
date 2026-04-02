import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const used = cookieStore.get("luvos_free_used");
  return Response.json({ isFree: !used });
}

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("luvos_free_used", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1년
    path: "/",
  });
  return Response.json({ ok: true });
}
