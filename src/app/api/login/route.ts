import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.body;
  return NextResponse.json({ message: "Login successful" });
}
