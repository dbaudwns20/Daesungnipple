"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NavLinks = [
  { name: "대시보드", href: "/management" },
  { name: "주문", href: "/management/orders" },
  { name: "상품", href: "/management/products" },
  { name: "회원", href: "/management/users" },
  { name: "카테고리", href: "/management/categories" },
  { name: "제조사", href: "/management/manufacturers" },
];

export default function ManagementLayout(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  const pathname = usePathname();

  return (
    <>
      <header>
        <nav className="flex w-full items-start gap-5 bg-gray-50 p-3 text-sm font-bold">
          {NavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                className={`${isActive ? "text-blue-500" : "text-gray-500"} hover:text-blue-400`}
                href={link.href}
                key={link.name}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </header>
      <main>
        <section className="p-3">{props.children}</section>
      </main>
    </>
  );
}
