import Image from "next/image";

export default function About() {
  return (
    <section>
      <div className="mx-auto max-w-4xl flex py-14">
        <div className="w-2/3">
          <h2 className="text-5xl">
            <span className="text-patty-blue">About</span> Us
          </h2>
          <p className="pt-5">
            Welcome to our Mariana hotel, where the allure of coastal beauty
            meets unparalleled luxury. Situated along Mariana's picturesque
            coastline, our hotel offers a sanctuary of tranquility and
            indulgence, inviting you to immerse yourself in an unforgettable
            escape.
          </p>
        </div>
        <div>
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
          <div className="flex flex-col">
            <h1 className="text-white text-2xl">Customer review</h1>
            <p>
              "From the moment we arrived at the Mariana hotel, we were blown
              away by the level of hospitality and attention to detail. The
              staff greeted us with warm smiles and went above and beyond to
              ensure our stay was nothing short of perfect. The location of the
              hotel is simply breathtaking, with stunning views of the coastline
              that took our breath away every morning. We loved being able to
              wake up to the sound of the waves crashing against the shore and
              watching the sunset from our balcony in the evenings"
            </p>
          </div>
        </div>
      </div>
      <h1 className="text-5xl">Show example room and book button</h1>
    </section>
  );
}
