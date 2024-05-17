import Link from "next/link";
import { auth } from "../auth";

export default async function StaffNav() {
  const session = await auth();

  return (
    <header className="bg-gray-600 text-white">
      <nav className="flex justify-between items-center w-full px-10 py-4">
        <div>Staff-Navvv</div>
        <div className="flex gap-10">
          <Link href="/employee/ceo">CEO</Link>
          <Link href="/employee/staff">Staff</Link>
          <Link href="/employee/janitor">Janitor</Link>
          {/* <Link href="/register">Register Staff acc</Link> */}
          {session ? (
            <Link href="/api/auth/signout?callbackUrl=/employee">Logout</Link>
          ) : (
            <Link href="/api/auth/signin">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
