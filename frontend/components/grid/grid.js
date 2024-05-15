import Image from "next/image";

export default function Grid({ items }) {
  console.log(items);
  return (
    <div>
      {items.length > 0 ? (
        <ul>
          {items.map((room) => (
            <div key={room.id}>
              <Image
                src="/images/deluxe2000.jpg"
                alt="Deluxe Room"
                width={100}
                height={100}
              />
              <div>
                <div>
                  <h3>{room.type}</h3>
                  <p>{room.price}</p>
                </div>
                <div>
                  <i>Image Placeholder</i>
                  <p>{room.capacity}</p>
                  <p>{room.children}</p>
                </div>
              </div>
              {room.available === "YES" && <button>Book</button>}
            </div>
          ))}
        </ul>
      ) : (
        <p>No room types loaded from grid</p>
      )}
    </div>
  );
}
