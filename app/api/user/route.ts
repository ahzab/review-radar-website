import {getUser} from "@/services/authService";

export async function GET() {
  const user = await getUser();
  return Response.json(user);
}
