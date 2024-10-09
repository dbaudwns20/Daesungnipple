"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NavLinks = [
  { name: "주문관리", href: "/management/orders" },
  { name: "상품관리", href: "/management/products" },
  { name: "카테고리관리", href: "/management/categories" },
  { name: "제조사관리", href: "/management/manufacturers" },
  { name: "사용자관리", href: "/management/users" },
];

export default function ManagementLayout(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  const pathname = usePathname();

  return (
    <main>
      <nav className="flex w-full items-start gap-5 bg-gray-50 p-3 text-sm font-bold">
        {NavLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);

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
      <section className="p-3">{props.children}</section>
    </main>
  );
}
