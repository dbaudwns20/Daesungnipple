import Link from "next/link";

export default function MainHeader() {
  return (
    <header className="bg-black text-white h-12">
      <Link href="/">Home</Link>
      <Link href="/login">로그인</Link>
    </header>
  );
}
