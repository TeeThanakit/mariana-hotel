import Link from "next/link";

export function RoleStaffNav(props) {
  if (props.current.includes("payment")) {
    return (
      <div>
        <div className="flex justify-center items-center gap-3 text-red-500">
          <Link href="/employee/staff">Booking</Link>
          <Link href="/employee/staff/contactus">Contact</Link>
        </div>
      </div>
    );
  }

  if (props.current == "booking") {
    return (
      <div>
        <div className="flex justify-center items-center gap-3 text-red-500">
          <Link href="/employee/staff">Booking</Link>
          <Link href="/employee/staff/contactus">Contact</Link>
        </div>
      </div>
    );
  }

  if (props.current == "contact") {
    return (
      <div>
        <div className="flex justify-center items-center gap-3 text-red-500">
          <Link href="/employee/staff">Booking</Link>
          <Link href="/employee/staff/payment">Payment</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center items-center gap-3 text-red-500">
        <Link href="/employee/staff/payment">Payment</Link>
        <Link href="/employee/staff/contactus">Contact</Link>
      </div>
    </div>
  );
}
