import { getUser } from "@/lib/auth/next-auth-utils";

export async function GET() {
  const user = await getUser();
  return Response.json(user);
}
