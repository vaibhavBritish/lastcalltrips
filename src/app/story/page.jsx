import Image from "next/image";
import { FaPlane, FaHotel, FaGlobe } from "react-icons/fa";

export default function Story() {
  return (
    <div className="flex flex-col">

      {/* Hero Section */}
      <section className="bg-[#155dfc] text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Explore the World with LastCallTrip</h1>
        <p className="text-xl max-w-3xl mx-auto">
          We find the cheapest flights, hotels, and all-inclusive deals so you can travel smarter, faster, and cheaper.
        </p>
        <a 
          href="/subscribe"
          className="mt-8 inline-block bg-white text-[#155dfc] font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Subscribe & Save
        </a>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-extrabold text-[#155dfc] mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg">
            At <span className="font-semibold">LastCallTrip</span>, our mission is simple: make travel affordable for everyone. We track down the cheapest flights, hotels, and all-inclusive packages so you can explore the world without emptying your wallet.
          </p>
        </div>
        <div className="lg:w-1/2">
          <Image 
            src="/ourstory.jpg" 
            alt="Our Story" 
            width={700} 
            height={400} 
            className="rounded-3xl shadow-lg hover:scale-105 transition duration-300"
          />
        </div>
      </section>

      {/* Why Choose Us - Features */}
      <section className="bg-gray-50 py-20 px-6">
        <h2 className="text-4xl font-extrabold text-[#155dfc] text-center mb-12">Why Choose LastCallTrip?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-3xl shadow hover:shadow-2xl transition duration-300 text-center">
            <FaPlane className="text-[#155dfc] text-5xl mx-auto mb-4"/>
            <h3 className="text-2xl font-bold mb-2">Cheap Flights</h3>
            <p className="text-gray-700">Access early and exclusive flight deals to save 30%-70% on your next adventure.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow hover:shadow-2xl transition duration-300 text-center">
            <FaHotel className="text-[#155dfc] text-5xl mx-auto mb-4"/>
            <h3 className="text-2xl font-bold mb-2">Hotel Deals</h3>
            <p className="text-gray-700">Curated hotel discounts in top destinations, ensuring comfort without overspending.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow hover:shadow-2xl transition duration-300 text-center">
            <FaGlobe className="text-[#155dfc] text-5xl mx-auto mb-4"/>
            <h3 className="text-2xl font-bold mb-2">All-Inclusive Packages</h3>
            <p className="text-gray-700">Get access to the best all-inclusive packages and plan stress-free trips for less.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 order-2 lg:order-1">
          <h2 className="text-4xl font-extrabold text-[#155dfc] mb-4">Our Story</h2>
          <p className="text-gray-700 text-lg mb-4">
            LastCallTrip was founded by two passionate travelers who wanted to make affordable travel accessible to everyone. Rishi discovers and shares the best travel deals, while Farah handles operations, marketing, and community engagement. We’re not travel agents—we’re travelers helping fellow adventurers.
          </p>
          <p className="text-gray-700 text-lg">
            From South Africa for $350 CAD, Spain & Portugal for $375, Paris for $250, and Orlando for $160, we’ve traveled the world on a budget. Now, we share the tips, tricks, and deals with our subscribers so they can experience similar adventures.
          </p>
        </div>
        <div className="lg:w-1/2 order-1 lg:order-2">
          <Image 
            src="/ourstory2.jpg" 
            alt="Our Journey" 
            width={700} 
            height={400} 
            className="rounded-3xl shadow-lg hover:scale-105 transition duration-300"
          />
        </div>
      </section>


      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-[#155dfc] mb-6">Contact Us</h2>
        <p className="text-gray-700 text-lg mb-4">
          Email: <a href="mailto:contact@lastcalltrip.com" className="text-[#155dfc] font-semibold hover:underline">contact@lastcalltrip.com</a>
        </p>
        <p className="text-gray-700 text-lg">
          Follow us on social media for instant updates on the latest travel deals!
        </p>
      </section>

    </div>
  );
}
