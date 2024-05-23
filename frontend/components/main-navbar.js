"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainNavigator() {
  const pathname = usePathname();
  const active = "rounded-full p-2.5 bg-patty-blue text-white";
  return (
    <header>
      <div className="max-w-5xl mx-auto font-bold flex items-center justify-between text-black bg-opacity-80  h-20 px-8">
        <Link href="/" className="pl-3.5">
          <h1>MARIANA</h1>
        </Link>
        <nav>
          <ul className="flex">
            <li className="px-3.5">
              <Link
                className={`link ${pathname === "/" ? active : ""}`}
                href="/"
              >
                Home
              </Link>
            </li>

            <li className="px-3.5">
              <Link
                className={`link ${pathname === "/about" ? active : ""}`}
                href="/about"
              >
                About
              </Link>
            </li>

            <li className="px-3.5">
              <Link
                className={`link ${pathname === "/contact" ? active : ""}`}
                href="/contact"
              >
                Contact
              </Link>
            </li>
            <li className="px-3.5 whitespace-nowrap">
              <Link
                className={`link ${pathname === "/booknow" ? active : ""}`}
                href="/booknow"
              >
                Book now!
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
