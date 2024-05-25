import Link from "next/link";

export function RoleStaffNav() {

  return (
    <div>
        <div className="flex justify-center items-center gap-3 text-red-500">
            <Link href="/employee/staff/payment">Payment</Link>
            <Link href="/employee/staff/contactus">Contact</Link>
        </div>
    </div>
  );
}
