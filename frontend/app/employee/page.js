import { auth } from "@/auth";

export default async function StaffPage() {
  const session = await auth();

  // if(session){
  //   console.log("Print session", session);
  // }
  return (
    <div className="text-center text-3xl mt-5">
      {!session ? (
        <h1>Here is a employee area, you gotta login first </h1>
      ) : (
        <h1>You are logged in</h1>
      )}
    </div>
  );
}
