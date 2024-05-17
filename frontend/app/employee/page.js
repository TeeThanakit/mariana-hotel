import { auth } from "@/auth";


export default async function StaffPage(){
    const session = await auth();
    return <div>
        <h1>Employee area</h1>
        <p>{session?.user?.email}</p>
    </div>
}