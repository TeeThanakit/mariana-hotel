import Link from "next/link";

export default function CeoPage() {
  return (
    <div>
      CEO only
      <Link href="/employee/ceo/register" className="bg-red-500">Register Staff</Link>
    </div>
  );
}
