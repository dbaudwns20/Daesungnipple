import Link from "next/link";

export default function MainHeader() {
  return (
    <header className="bg-black text-white h-12">
      <Link href="/">Home</Link>
    </header>
  );
}
