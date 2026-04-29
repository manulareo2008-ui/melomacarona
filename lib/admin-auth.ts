import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "cursos_admin_token";

export function getExpectedAdminToken(): string {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) return "";
  return createHmac("sha256", secret).update("admin-granted").digest("base64url");
}

export async function isAdminSessionValid(): Promise<boolean> {
  const expected = getExpectedAdminToken();
  if (!expected) return false;
  const store = await cookies();
  const token = store.get(COOKIE)?.value ?? "";
  if (!token) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export { COOKIE as ADMIN_TOKEN_COOKIE_NAME };
