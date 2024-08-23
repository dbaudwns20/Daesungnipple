import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/prisma";

export async function GET(request: NextRequest) {
  const user = await prisma.user.findMany();

  const res = JSON.parse(JSON.stringify(user));

  return NextResponse.json(res);
}
