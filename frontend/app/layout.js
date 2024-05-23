import { Inter } from "next/font/google";
import "./globals.css";
import MainNavigator from "@/components/main-navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
