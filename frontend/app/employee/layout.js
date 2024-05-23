import StaffNav from "@/components/staff-navbar";

export default function StaffLayout({ children }) {
  return (
    <>
        <StaffNav/>
        <main>{children}</main>
    </>
  );
}

// export default function StaffLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <StaffNav/>
//         <main>{children}</main>
//       </body>
//     </html>
//   );
// }
