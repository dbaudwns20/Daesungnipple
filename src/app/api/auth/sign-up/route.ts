import { type NextRequest, NextResponse } from "next/server";

import { createUser } from "@/services/auth/sign.up.service";

export async function POST(request: NextRequest) {
  try {
    await createUser(await request.json());
    return NextResponse.json({ message: "created." }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
