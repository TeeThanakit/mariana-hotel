import { RoleStaffNav } from "@/components/staff-role-nav";

async function getBookedRoom() {
  try {
    const response = await fetch("http://localhost:5001/api/paymentview", {
      next: {
        revalidate: 1,
      },
    });
    const jsonData = await response.json();
    if (response.ok) {
      return jsonData;
    } else {
      throw new Error("Failed to fetch data: " + jsonData.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error fetching data: " + error.message);
  }
}

export default async function Staff() {
  // const data = await getBookedRoom();
  const data = [
    {
      _id: "1",
      room: "A101 dummy data",
      check_in_date: "2021-10-10 dummy data",
      Name: "John Doe dummy data",
      Tel: "0812345678 dummy data",
    },
  ];
  const style = "py-2 px-4 text-left text-sm font-medium text-gray-700";
  const style1 = "py-2 px-4 text-sm text-gray-700";
  return (
    <div>
      <div className="mt-5">
        <RoleStaffNav />
      </div>
      <div className="container mx-auto p-4">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className={style}>Room</th>
              <th className={style}>Checkin time</th>
              <th className={style}>Name</th>
              <th className={style}>tel:</th>
            </tr>
          </thead>
          <tbody>
            {data.map((data) => (
              <tr key={data._id} className="border-b border-gray-200">
                <td className={style1}>{data.room}</td>
                <td className={style1}>{data.check_in_date}</td>
                <td className={style1}>{data.Name}</td>
                <td className={style1}>{data.Tel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
