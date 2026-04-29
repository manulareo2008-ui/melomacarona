import { NextResponse } from "next/server";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { readServerEvents } from "@/lib/server-analytics";

export async function GET() {
  if (!(await isAdminSessionValid())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const events = await readServerEvents();
  return NextResponse.json({ events, source: "server" as const });
}
