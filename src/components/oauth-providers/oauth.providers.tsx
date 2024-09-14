import { useTransition } from "react";

import { SignInByOAuthAction } from "@/actions/auth.actions";

import Button, { type ButtonType } from "@/components/button/button";

import Google from "@/assets/google.svg";
import Kakao from "@/assets/kakao.svg";
import Naver from "@/assets/naver.svg";

type ProviderUi = {
  icon: any;
  text: string;
  provider: string;
  additionalClass: string;
  textColor: string;
};

const providerUiMap: Map<string, ProviderUi> = new Map<string, ProviderUi>([
  [
    "GOOGLE",
    {
      icon: <Google width={20} height={20} />,
      text: "구글로 시작하기",
      provider: "google",
      additionalClass: "w-full relative bg-white focus:outline-gray-200",
      textColor: "text-[#1f1f1f]",
    },
  ],
  [
    "NAVER",
    {
      icon: <Naver width={20} height={20} />,
      text: "네이버로 시작하기",
      provider: "naver",
      additionalClass:
        "w-full relative bg-[#03c75a] focus:outline-[#03c75a]/50",
      textColor: "text-white",
    },
  ],
  [
    "KAKAO",
    {
      icon: <Kakao width={20} height={20} />,
      text: "카카오로 시작하기",
      provider: "kakao",
      additionalClass:
        "w-full relative bg-[#FEE500] focus:outline-[#FEE500]/50",
      textColor: "text-[#191919]",
    },
  ],
]);

function setProviders() {
  const providers: any = [];
  const envProviders: string[] =
    process.env.NEXT_PUBLIC_AUTH_PROVIDERS!.split("|");
  envProviders.forEach((provider) => {
    if (providerUiMap.has(provider)) {
      providers.push(providerUiMap.get(provider)!);
    }
  });
  return providers;
}

export default function OAuthProviders() {
  const providers: ProviderUi[] = setProviders();

  const [isFetching, startTransition] = useTransition();

  const signInByOAuth = (type: string) => {
    startTransition(async () => {
      await SignInByOAuthAction({ type });
    });
  };

  return (
    <>
      <div className="flex items-center py-5 text-sm font-semibold uppercase text-gray-500 before:me-4 before:flex-1 before:border-t before:border-gray-200 after:ms-4 after:flex-1 after:border-t after:border-gray-200 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
        다른 계정으로 로그인
      </div>
      <div className="grid gap-3">
        {providers.map((it, id) => {
          return (
            <Button
              key={id}
              size="sm"
              type="button"
              isDisabled={isFetching}
              additionalClass={it.additionalClass}
              onClick={() => signInByOAuth(it.provider)}
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                {it.icon}
              </span>
              <span className={it.textColor}>{it.text}</span>
            </Button>
          );
        })}
      </div>
    </>
  );
}
