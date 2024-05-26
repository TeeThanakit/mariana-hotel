import Link from "next/link";

export default function CeoPage() {
  return (
    <div>
      <h1 className="text-center m-4 text-2xl">CEO area</h1>
      <div className="flex gap-3 justify-center">
        <Link href="/employee/ceo/register" className="bg-red-500">
          Register Staff
        </Link>
        <Link href="/employee/ceo/dashboard" className="bg-red-500">
          Dashboard
        </Link>
        <Link href="/employee/ceo/stafflist" className="bg-red-500">
          Staff List
        </Link>
        <Link href="/employee/ceo/addroom" className="bg-red-500">
          Add Room
        </Link>
        <Link href="/employee/ceo/analytic" className="bg-red-500">
          Analytic
        </Link>
      </div>
    </div>
  );
}
