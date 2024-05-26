import { Inter } from "next/font/google";
import "./globals.css";
import MainNavigator from "@/components/main-navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mariana Hotel",
  description: "This is our frist project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <MainNavigator/> */}
        <main>{children}</main>
      </body>
    </html>
  );
}
