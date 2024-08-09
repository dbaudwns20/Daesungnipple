import { NextRequest, NextResponse } from "next/server";

import prisma from "@/utils/prisma";

export async function GET(request: NextRequest) {
  const user = await prisma.user.findMany();

  const res = JSON.parse(
    JSON.stringify(
      user,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    )
  );

  return NextResponse.json(res);
}
