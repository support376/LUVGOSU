import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const paid = cookieStore.get("luvos_paid");
  return Response.json({ isPaid: !!paid });
}

// 시뮬레이션 완료 후 사용 처리
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("luvos_paid");
  return Response.json({ ok: true });
}
