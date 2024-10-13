import { Provider } from "@/types";

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import Credentials from "next-auth/providers/credentials";
import type { Provider as AuthProvider } from "next-auth/providers";

import {
  getAuthUser,
  findUserByEmail,
  checkUserHasLinkedProvider,
} from "@/services/auth.service";

const providerMap: Map<string, AuthProvider> = new Map<string, AuthProvider>([
  ["GOOGLE", Google],
  ["NAVER", Naver],
  ["KAKAO", Kakao],
]);

const providers: AuthProvider[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      const user = await getAuthUser(
        credentials.email as string,
        credentials.password as string,
      )!;

      // 기본 로그인 시 해당 이메일이 OAuth 계정으로 연동 되어있는지 체크
      if (await checkUserHasLinkedProvider(user!.id)) {
        throw new Error(
          "소셜 로그인에 연동된 이메일입니다\n소셜 로그인을 이용해주세요",
        );
      }

      return user;
    },
  }),
];

function setProviders(): AuthProvider[] {
  const envProviders: string[] =
    process.env.NEXT_PUBLIC_AUTH_PROVIDERS!.split("|");
  envProviders.forEach((provider) => {
    if (providerMap.has(provider)) {
      providers.push(providerMap.get(provider)!);
    }
  });
  return providers;
}

/**
 * 네이버 OAuth2 는 OAuth 2.0 스펙을 엄격히 지키지 않기 때문에 인터셉터로 중간 처리 필요
 * expires_in 이 string type 으로 응답을 받기 때문에 Auth.js 에서 에러발생.
 * response 를 새로 만들어서 리턴한다.
 * @param originalFetch
 * @returns
 */
export const naverFetchInterceptor =
  (originalFetch: typeof fetch) =>
  async (
    url: Parameters<typeof fetch>[0],
    options: Parameters<typeof fetch>[1] = {},
  ) => {
    // 네이버 토큰 호출 API 만 인터셉트 한다
    if (
      url === "https://nid.naver.com/oauth2.0/token" &&
      options.method === "POST"
    ) {
      const response = await originalFetch(url, options);
      /* Clone the response to be able to modify it */
      const clonedResponse = response.clone();
      const body = await clonedResponse.json();

      body.expires_in = Number(body.expires_in);

      /*  Create a new response with the modified body */
      const modifiedResponse = new Response(JSON.stringify(body), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });

      /* Add the original url to the response */
      return Object.defineProperty(modifiedResponse, "url", {
        value: response.url,
      });
    }

    return originalFetch(url, options);
  };

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: setProviders(),
  callbacks: {
    async signIn({ user, account, profile }) {
      // provider (google, kakao, naver)
      const provider: string = account!.provider.toUpperCase();

      // 이메일로 DB 사용자 정보 가져오기
      const dbUser = await findUserByEmail(user.email!);

      // 가입된 이용자가 아니라면 회원가입 페이지로 이동시킨다
      if (!dbUser)
        return encodeURI(
          `/sign-up?email=${user!.email}&image=${user!.image}&provider=${provider}`,
        );

      // OAuth 로그인 시 해당 이메일이 기존 회원가입 되어있는지 체크
      if (
        provider != "CREDENTIALS" &&
        !(await checkUserHasLinkedProvider(dbUser!.id, provider as Provider))
      )
        return encodeURI(
          `/sign-in/error?error_message=이미 회원가입 된 이메일입니다.\n기본 로그인을 이용해 주세요.`,
        );

      return true;
    },
  },
  pages: {
    signIn: "/sign-in", // 커스텀 페이지
    error: "/sign-in/error",
  },
});
