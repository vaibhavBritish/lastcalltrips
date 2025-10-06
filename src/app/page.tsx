"use client";

import Image from "next/image";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { redirect, useRouter } from "next/navigation";


export default function Home() {
  const howWeWorkSteps = [
    { id: 1, title: "Join", desc: "Join over 200,000 subscribers and save on average $400 per flight! We find deals to all sorts of destinations from Canada.", image: "/join.png" },
    { id: 2, title: "Discover", desc: "The team at Last Call Trips are the experts at uncovering insane cheap flights, unadvertised sales and mistake fares!", image: "/discover.png" },
    { id: 3, title: "Travel", desc: "Customize your deal alerts and get instant notifications to score the deal of a lifetime!", image: "/travel.png" },
  ]

  const reviews = [
    { id: 1, name: "Sukan thapa", date: "2024-03-22", desc: "Last Call Trips is a game-changer for budget travelers like me. Their alerts have helped me snag incredible flight deals that I wouldn't have found otherwise. Highly recommend!", image: "/user.png" },
    { id: 2, name: "Jane Doe", date: "2024-02-15", desc: "I can't believe the savings I've made since subscribing to Last Call Trips. Their team is always on top of the latest deals, and I've booked trips to Europe and Asia for a fraction of the cost!", image: "/user.png" },
    { id: 3, name: "John Smith", date: "2024-01-10", desc: "As a frequent traveler, Last Call Trips has become my go-to resource for finding cheap flights. Their alerts are timely and accurate, and I've saved hundreds of dollars on my trips.", image: "/user.png" },
  ]

  const faqs = [
  {
    question: "How does LastCallTrips work?",
    ans: "LastCallTrips is your go-to travel deal finder! We search the web 24/7 to uncover hidden flight deals, error fares, and unadvertised discounts, helping you save 30%-70% on flights. Subscribers receive instant push notifications and email alerts with all the details, including availability and booking instructions. Travel smarter, faster, and cheaper with LastCallTrips!"
  },
  {
    question: "Is the LastCallTrips app free?",
    ans: "Yes! The LastCallTrips app is free to download and use. We offer a freemium model: the free version gives you basic deal alerts, while premium subscribers enjoy instant notifications, personalized alerts, and exclusive deals."
  },
  {
    question: "How do I book a flight deal?",
    ans: "Once you receive a deal alert, follow the booking instructions in the notification. This will usually take you directly to the airline or travel agency's website to complete your booking. Booking is quick, simple, and always at the discounted rate we notify you about!"
  },
  {
    question: "How long are deals valid?",
    ans: "Flight deals can be short-lived—some last only a few hours while others may stay available for a day or two. To maximize savings, we recommend booking as soon as you receive a deal alert."
  },
  {
    question: "What is the difference between premium and free subscribers?",
    ans: "Premium subscribers receive all flight deal alerts, including exclusive and error fares. Free subscribers receive fewer alerts per week and may miss some of the best deals. Premium ensures you never miss a low-price flight!"
  },
  {
    question: "Which departure cities and destinations are covered?",
    ans: "We cover major Canadian departure cities including Toronto, Vancouver, Montreal, Calgary, Edmonton, Ottawa, and Halifax. Popular destination regions include North America, Europe, Asia, South America, Africa, and Oceania."
  },
  {
    question: "How many deal notifications will I receive?",
    ans: "Free subscribers typically get 3–5 deal notifications per week. Premium subscribers receive unlimited notifications tailored to their selected departure cities and preferred regions."
  },
  {
    question: "What is LastCallTrips' refund and cancellation policy?",
    ans: "Premium subscriptions come with a 7-day money-back guarantee. If you’re not satisfied within the first 7 days, contact our support team for a full refund. Subscriptions can be canceled anytime via your account settings."
  },
  {
    question: "Do you also offer hotel or vacation package deals?",
    ans: "Occasionally, we post hotel or vacation package deals, but our main focus is on finding the cheapest flight deals to save you the most money."
  },
  {
    question: "Can I select specific travel dates or destinations?",
    ans: "We don’t offer exact date selection because the best deals often require flexibility. The more flexible your travel dates and destinations, the more deals you’ll get."
  }
];

  const [openIndex, setOpenIndex] = useState(-1);

  const toggleFAQ = (i: number) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  const [formData, setformData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const [error, seterror] = useState(null)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json();

    if (!res.ok) {
      seterror(data.error || 'Something went wrong')
      return;
    }
    setformData({
      name: "",
      email: "",
      subject: "",
      message: ""
    })
    alert('Message sent successfully')
    redirect('/')

  }

  return (
    <>

      <div className="relative w-screen h-screen">
        <Image
          src="/headerplane.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-sky-300/70 to-sky-400/70" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full px-6 text-center md:text-left">
          <div className="relative w-[220px] h-[440px] sm:w-[260px] sm:h-[520px] md:w-[280px] md:h-[560px] mb-8 md:mb-0">
            <Image
              src="/mobilePhoneMain.png"
              alt="Phone Mockup"
              fill
              className="object-contain"
              priority
            />
          </div>


          <div className="md:ml-12 max-w-lg text-white">
            <h1 className="text-3xl sm:text-4xl font-bold leading-snug">
              Never Pay Full Price for a Flight Again
            </h1>
            <p className="mt-4 text-base sm:text-lg font-medium text-justify">
              We keep eye out for the best flight deals and mistake fares departing from Canadian cities.
            </p>
            <button className="mt-6 px-6 py-3 bg-orange-400 hover:bg-orange-500 text-black font-semibold rounded-lg shadow-lg transition">
              Get Access
            </button>
          </div>
        </div>
      </div>


      <div className="flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#4dd1fe]">How we work</h1>
        <div className="flex flex-col md:flex-row items-center justify-center text-justify mt-8 space-y-8 md:space-y-0 md:space-x-12 max-w-6xl">
          {howWeWorkSteps.map((step) => (
            <div
              key={step.id}
              className="max-w-2xl text-center mt-8 border p-6 border-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 mb-16"
            >
              <Image
                src={step.image}
                alt="Step Image"
                width={100}
                height={100}
                className="mb-8 mx-auto" />

              <h1 className="font-bold text-xl text-[#4dd1fe]">{step.title}</h1>
              <p className="text-justify">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-100 py-12 px-4 text-center ">
        <div>
          <h1 className="text-2xl text-[#4dd1fe] font-bold">Deals We've Found in the past</h1>
          <p className="text-sm text-gray-400 font-mono mt-5">Some the cheapest flight deals from the past year</p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { from: "Toronto", to: "Dublin", price: "$350", image: "/torontodublin.jpg" },
            { from: "Montreal", to: "Paris", price: "$400", image: "/montparis.jpg" },
            { from: "Edmonton", to: "New York", price: "$200", image: "/lasvegas.jpg" },
            { from: "Ottawa", to: "Rome", price: "$380", image: "/ottawa.jpg" },
          ].map((deal, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:shadow-[#4dd1fe] transition-shadow duration-300">
              <Image
                src={deal.image}
                alt={`${deal.from} to ${deal.to}`}
                width={300}
                height={200}
                className="w-full h-40 object-cover rounded-md mb-4 hover:scale-105 transition-transform duration-300"
              />
              <h2 className="text-lg font-bold text-gray-800">{deal.from} → {deal.to}</h2>
              <p className="mt-2 text-[#4dd1fe] font-bold">{deal.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#4dd1fe]">
        <h1 className="font-bold text-white text-3xl">What Our Members Say</h1>

        <div className="flex flex-col md:flex-row items-center justify-center mt-8 space-y-8 md:space-y-0 md:space-x-8 max-w-6xl">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl hover:shadow-gray-600 hover:scale-105 transition-all duration-300 p-6 w-[320px]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Image
                    src={review.image}
                    alt={review.name}
                    width={45}
                    height={45}
                    className="rounded-full"
                  />
                  <div>
                    <h2 className="text-gray-800 font-semibold">{review.name}</h2>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
                <Image src="/google.png" alt="Google" width={20} height={20} />
              </div>

              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}

              </div>

              <p className="text-gray-700 text-sm">{review.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-100">
        <h1 className="font-bold text-2xl text-[#4dd1fe]">Got More Questions?</h1>
        <div className="mt-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {faqs.map((q, i) => (
            <div key={i}>
              <button
                onClick={() => toggleFAQ(i)}
                className="flex justify-between w-full text-left font-bold py-3 border-b ">
                {q.question}
                <span>{openIndex === i ? "▲" : "▶"}</span>
              </button>
              {openIndex === i && (
                <p className="mt-2 text-md text-gray-600 text-justify">
                  {q.ans}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12 bg-gray-100">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-lg flex flex-col space-y-6">
          <h2 className="text-3xl font-bold text-center text-[#4dd1fe]">
            Contact Us
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">

              <label htmlFor="name" className="mb-2 font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4dd1fe] focus:border-[#4dd1fe] transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4dd1fe] focus:border-[#4dd1fe] transition"
              />
            </div>
          </div>


          <div className="flex flex-col">
            <label htmlFor="subject" className="mb-2 font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4dd1fe] focus:border-[#4dd1fe] transition"
            />
          </div>


          <div className="flex flex-col">
            <label htmlFor="message" className="mb-2 font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              name="message"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4dd1fe] focus:border-[#4dd1fe] transition"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-[#4dd1fe] font-semibold rounded-lg shadow-md hover:bg-[#34b8e6] transition-all duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </>
  );
}
