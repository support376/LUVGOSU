export async function GET() {
  return Response.json({
    clientKey: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "",
  });
}
