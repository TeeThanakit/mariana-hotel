import Image from "next/image";
import Link from "next/link";

async function getAllRoom() {
  const res = await fetch("http://localhost:5001/api/rooms", {
    next: {
      revalidate: 1,
    },
  });
  const data = res.json();
  if (res.ok) {
    return data;
  } else {
    throw new Error("Failed to fetch data: ");
  }
}

export default async function AddRoom() {
  const data = await getAllRoom();
  return (
    <div>
      <div className="flex justify-center m-5">
        <button className="bg-green-400">Add more room+</button>
      </div>
      <div className="space-y-8">
        {data.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row"
          >
            <Image
              src={room.image}
              alt={`Room ${room.room}`}
              width={600}
              height={300}
            //   className="w-full md:w-1/3 h-64 md:h-auto object-cover"
            />
            <div className="p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  {room.room}
                </h2>
                <p className="text-lg mb-2 text-gray-600">Type: {room.types}</p>
                <p className="text-lg mb-2 text-gray-600">
                  Price: ${room.price}
                </p>
                <p className="text-lg mb-2 text-gray-600">
                  Capacity: {room.capacity}
                </p>
                <p className="text-lg mb-4 text-gray-600">
                  Children: {room.children}
                </p>
              </div>
              <div className="flex justify-between gap-3">
                {/* Dummy button no action */}
                <button className="text-white bg-green-500">Update</button>
                <button className="text-white bg-red-500">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
