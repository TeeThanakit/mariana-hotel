import { auth } from "@/auth";

export default async function StaffPage() {
  const session = await auth();
  if(session){
    console.log("Print session", session);
  }
  return (
    <div>
      <h1>Employee area</h1>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.username}</p>
      <p>{session?.user?.role}</p>
    </div>
  );
}
