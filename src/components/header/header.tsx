import Link from "next/link";

export default function MainHeader() {
  return (
    <header className="h-12 bg-black text-white">
      <Link href="/">Home</Link>
      <Link href="/sign-in">로그인</Link>
    </header>
  );
}
