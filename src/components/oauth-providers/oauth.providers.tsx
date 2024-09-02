import { SignInAction } from "@/actions/auth.actions";

import Button, { type ButtonType } from "@/components/button/button";

import Google from "@/assets/google.svg";
import Kakao from "@/assets/kakao.svg";
import Naver from "@/assets/naver.svg";

export default function OAuthProviders() {
  const signInByOAuth = async (type: string) => {
    try {
      await SignInAction({ type });
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <div className="grid gap-3">
      <Button
        size="sm"
        type="button"
        additionalClass="w-full relative bg-white focus:outline-gray-200"
        onClick={() => signInByOAuth("google")}
      >
        <span className="absolute left-4 top-1/2 -translate-y-1/2">
          <Google width={20} height={20} />
        </span>
        <span className="text-[#1f1f1f]">구글로 시작하기</span>
      </Button>
      <Button
        size="sm"
        type="button"
        additionalClass="w-full relative bg-[#03c75a] focus:outline-[#03c75a]/50"
        onClick={() => signInByOAuth("naver")}
      >
        <span className="absolute left-4 top-1/2 -translate-y-1/2">
          <Naver width={20} height={20} />
        </span>
        <span className="text-white-500">네이버로 시작하기</span>
      </Button>
      <Button
        size="sm"
        type="button"
        additionalClass="w-full relative bg-[#FEE500] focus:outline-[#FEE500]/50"
        onClick={() => signInByOAuth("kakao")}
      >
        <span className="absolute left-4 top-1/2 -translate-y-1/2">
          <Kakao width={20} height={20} />
        </span>
        <span className="text-[#191919]">카카오로 시작하기</span>
      </Button>
    </div>
  );
}
