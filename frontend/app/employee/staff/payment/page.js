async function getPayment() {
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

export default async function Payment() {
  const style = "py-2 px-4 text-left text-sm font-medium text-gray-700";
  const style1 = "py-2 px-4 text-sm text-gray-700";
  const data = await getPayment();
  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className={style}>Timestamp</th>
            <th className={style}>Payment type</th>
            <th className={style}>Price</th>
            <th className={style}>Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data) => (
            <tr key={data._id} className="border-b border-gray-200">
              <td className={style1}>{data.timestamp}</td>
              <td className={style1}>{data.type}</td>
              <td className={style1}>{data.total_price}</td>
              <td className={style1}>{data.Name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
