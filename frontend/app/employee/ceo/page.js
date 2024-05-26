import Link from "next/link";

export default function CeoPage() {
  return (
    <div>
      CEO only
      <div className="flex gap-3">
        <Link href="/employee/ceo/register" className="bg-red-500">
          Register Staff
        </Link>
        <Link href="/employee/ceo/dashboard" className="bg-red-500">
          Dashboard
        </Link>
        <Link href="/employee/ceo/stafflist" className="bg-red-500">
          Staff List
        </Link>
      </div>
    </div>
  );
}
