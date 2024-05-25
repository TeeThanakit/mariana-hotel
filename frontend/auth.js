import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
// import StaffCredential from "./app/(model)/StaffCredential";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Google({
    //   profile(profile) {
    //     console.log("Profile of Google ", profile);

    //     let userRole = "Google User";

    //     return {
    //       ...profile,
    //       id: profile.sub,
    //       role: userRole,
    //     };
    //   },
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_Secret,
    // }),
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        // logic to salt and hash password
        // const pwHash = saltAndHashPassword(credentials.password);

        // Add logging to see exactly what is sent
        // console.log("Sending credentials:", credentials);

        try {
          const response = await fetch("http://localhost:5001/api/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Authentication failed");
          }
          // console.log("From auth", data);
          return data;
        } catch (error) {
          console.error("Authentication error:", error.message);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }
      // console.log("User Token", token)
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.username = token.username;
      }
      // console.log("User session", session)
      return session;
    },
  },
});
