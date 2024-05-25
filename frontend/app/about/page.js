import Image from "next/image";
import Link from "next/link"; // Import Link
import MainNavigator from "@/components/main-navbar";

export default function About() {
  return (
    <>
      <MainNavigator />
      <section>
        <div className="mx-auto max-w-4xl flex flex-col md:flex-row py-14">
          <div className="w-full md:w-2/3 md:pr-10">
            <h2 className="text-5xl mb-6">
              <span className="text-patty-blue">About</span> Us
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              Welcome to our Mariana hotel, where the allure of coastal beauty
              meets unparalleled luxury. Situated along Mariana's picturesque
              coastline, our hotel offers a sanctuary of tranquility and
              indulgence, inviting you to immerse yourself in an unforgettable
              escape.
            </p>
          </div>
          <div className="w-full md:w-1/3">
            <Image
              src="/images/forAboutPage.jpg"
              width={500}
              height={500}
              alt="Picture of the underwater hotel"
            />
          </div>
        </div>

        <div className="bg-brown rounded-lg py-10">
          <div className="mx-auto max-w-5xl">
            <div className="text-center md:text-left">
              <h1 className="text-white text-2xl mb-4">Customer Review</h1>
              <p className="text-white text-lg leading-relaxed">
                "From the moment we arrived at the Mariana hotel, we were blown
                away by the level of hospitality and attention to detail. The
                staff greeted us with warm smiles and went above and beyond to
                ensure our stay was nothing short of perfect. The location of
                the hotel is simply breathtaking, with stunning views of the
                coastline that took our breath away every morning. We loved
                being able to wake up to the sound of the waves crashing against
                the shore and watching the sunset from our balcony in the
                evenings"
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl py-14">
          <div className="flex flex-wrap justify-center items-stretch mb-14">
            <RoomCard
              image="/images/single_bedded_room.jpg"
              title="Single Bedded Room"
              description="Our Basic Room offers a comfortable and affordable stay with all the essential amenities."
              roomType="basic"
            />
            <RoomCard
              image="/images/suite.jpg"
              title="Suite Room"
              description="The Suite offers stunning views of the coastline and luxurious amenities to ensure a comfortable and memorable stay."
              roomType="deluxe"
            />
            <RoomCard
              image="/images/studios.jpg"
              title="Studio"
              description="Our Master size provides the ultimate in luxury and comfort."
              roomType="master-suite"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function RoomCard({ image, title, description, roomType }) {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="relative h-64">
          <Image src={image} layout="fill" objectFit="cover" alt={title} />
        </div>
        <div className="p-6">
          <h2 className="text-2xl mb-4">{title}</h2>
          <p className="text-lg">{description}</p>
          <Link href={`/booknow?roomType=${roomType}`}>
            <button className="bg-patty-blue text-white py-2 px-6 rounded-lg mt-4 text-lg">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
