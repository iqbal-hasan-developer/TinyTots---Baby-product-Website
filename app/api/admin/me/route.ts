import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdminForApi();

  if (!admin.ok) {
    return admin.response;
  }

  return NextResponse.json({
    ok: true,
    user: {
      id: admin.user.id,
      email: admin.user.email,
    },
  });
}
