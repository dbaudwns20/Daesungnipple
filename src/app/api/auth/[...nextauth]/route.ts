import { type NextRequest, NextResponse } from "next/server";

import { handlers, naverFetchInterceptor } from "@/auth"; // Referring to the auth.ts we just created

const AuthGET = handlers.GET;
const AuthPOST = handlers.POST;

const originalFetch = fetch;

export async function GET(req: NextRequest) {
  const url: URL = new URL(req.url);

  // 네이버 OAuth2 는 OAuth 2.0 스펙을 엄격히 지키지 않기 때문에 인터셉터로 중간 처리 필요
  if (url.pathname === "/api/auth/callback/naver") {
    global.fetch = naverFetchInterceptor(originalFetch);
    const response = await AuthGET(req);
    global.fetch = originalFetch;
    return response;
  }

  return await AuthGET(req);
}

export async function POST(req: NextRequest) {
  return await AuthPOST(req);
}
