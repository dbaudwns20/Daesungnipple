import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";

import { getAuthUser, checkUserExist } from "@/services/auth/sign.in.service";

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      let user: any = await getAuthUser({
        email: credentials.email as string,
        password: credentials.password as string,
      });
      return user;
    },
  }),
  Google,
  Naver,
  Kakao,
];

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
  providers: providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email, name } = user;
      const provider: string = account!.provider;
      // 가입된 이용자가 아니라면 회원가입 페이지로 이동시킨다
      if (await checkUserExist(user.email!)) {
        return encodeURI(
          `/sign-up?email=${email}&name=${name}&provider=${provider.toUpperCase()}`,
        );
      }
      return true;
    },
  },
  pages: {
    signIn: "/sign-in", // 커스텀 페이지
  },
});
