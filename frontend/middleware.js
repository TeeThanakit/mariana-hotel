// export { auth as middleware } from "@/auth";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// export default auth((req) => {
//   if (!req.auth) {
//     const url = req.url.replace(req.nextUrl.pathname, "/login");
//     return Response.redirect(url);
//   }
// });

export async function middleware(request) {
  const session = await auth();

  // console.log("From middleware", request)
  if (
    request.nextUrl.pathname.includes("ceo") &&
    session?.user?.role != "CEO"
  ) {
    console.log("1");
    return NextResponse.rewrite(new URL("/employee/denied", request.url));
  }

  if (
    request.nextUrl.pathname.includes("staff") &&
    (session?.user?.role != "staff" && session.user.role != "CEO")
  ) {
    console.log("2");
    return NextResponse.rewrite(new URL("/employee/denied", request.url));
  }
}

export const config = {
  matcher: ["/employee/:path*"],
};
