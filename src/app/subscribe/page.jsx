"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

const Subscribe = () => {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState(null);

  const subscriptionBenefits = [
    { id: 1, title: "Mobile App & Email Alerts", desc: "Get flight deal alerts first via push notifications and email. More time to book before prices expire." },
    { id: 2, title: "Custom Departure & Destination", desc: "Choose your departure city and preferred destination region. See only the deals that matter most to you." },
    { id: 3, title: "Book Your Way", desc: "Get full booking instructions. Book directly with the airline or trusted third-party sites." },
    { id: 4, title: "Get Every Flight Deal", desc: "Standard subscribers get every deal for their city & destination. Limited plans only get 25%." },
    { id: 5, title: "30 Day Money Back Guarantee", desc: "Try risk-free. Full refund available within 30 days if it's not the right fit." },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setFormData({ name: "", email: "", subject: "", message: "" });
      alert('Message sent successfully');
    } catch (err) {
      setError('Failed to send message');
    }
  };

const handleSubscription = async (planType) => {
  try {
    setLoadingPlan(planType);
    setError(null);

    const res = await fetch("/api/auth/me");
    const { user } = await res.json();

    if (!user?.id) {
      throw new Error("User not logged in");
    }

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planType, id: user.id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create checkout session");
    }

    const { url } = await response.json();

    window.location.href = url;
  } catch (err) {
    console.error("Error:", err);
    setError(err.message || "Something went wrong");
  } finally {
    setLoadingPlan(null);
  }
};




  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gray-500 bg-clip-text text-transparent">
          Join 200,000+ Members & Save $400+ Per Flight
        </h1>
        <p className="mt-6 text-lg sm:text-xl font-medium text-gray-600">
          Choose the plan that's right for you
        </p>
      </div>

 
      {error && (
        <div className="mt-8 max-w-2xl mx-auto p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          <button onClick={() => setError(null)} className="mt-2 text-sm underline hover:no-underline">Dismiss</button>
        </div>
      )}


      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {["essential", "premium"].map((planType) => (
          <PlanCard key={planType} planType={planType} loadingPlan={loadingPlan} handleSubscription={handleSubscription} />
        ))}
      </div>

      <div className="flex flex-col items-center mt-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Subscription Benefits</h2>
        <p className="text-gray-500 mb-10">Exclusive perks for members</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {subscriptionBenefits.map((benefit) => (
            <div key={benefit.id} className="p-6 bg-white rounded-2xl shadow-md transition duration-300 hover:shadow-2xl hover:shadow-blue-300">
              <h3 className="text-lg font-semibold text-gray-800">{benefit.title}</h3>
              <p className="mt-2 text-gray-600 text-sm text-justify">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

    
      <div className="flex items-center justify-center px-4 py-12 bg-gray-100 mt-20 rounded-2xl">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-lg flex flex-col space-y-6">
          <h2 className="text-3xl font-bold text-center text-[#4dd1fe]">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["name", "email"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter your ${field}`}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4dd1fe] focus:border-[#4dd1fe] transition"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Subject</label>
            <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Enter subject" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4dd1fe] focus:border-[#4dd1fe] transition" />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Message</label>
            <textarea name="message" rows="5" value={formData.message} onChange={handleChange} placeholder="Write your message..." className="px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4dd1fe] focus:border-[#4dd1fe] transition" />
          </div>

          <button type="submit" className="w-full py-3 text-white bg-[#4dd1fe] font-semibold rounded-lg shadow-md hover:bg-[#34b8e6] transition-all duration-300">Send Message</button>
        </form>
      </div>
    </div>
  );
};

const PlanCard = ({ planType, loadingPlan, handleSubscription }) => {
  const planData = {
    essential: {
      title: "Essential Plan",
      benefits: ["Receive 4x MORE Flight Deals", "Choose Your Destination Region(s)", "Choose Your Departure(s)", "Access to Mobile App Features"],
      price: "$35.99"
    },
    premium: {
      title: "Premium Plan",
      benefits: ["Early Access to Deals", "Mistake Fares", "Access to Private Discord", "100% Ad-Free"],
      price: "$59.99"
    }
  };

  return (
    <div className="border border-gray-200 p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{planData[planType].title}</h2>
      <ul className="space-y-3 text-gray-600">
        {planData[planType].benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="text-green-500 w-5 h-5 mt-1" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-6 p-6 bg-blue-400 rounded-xl text-center text-white">
        <h3 className="text-lg font-semibold">Yearly</h3>
        <p className="text-3xl font-extrabold">{planData[planType].price}</p>
        <p className="text-sm mt-2 mb-4">Billed Annually • Cancel Anytime • 30-Day Guarantee</p>
        <button
          onClick={() => handleSubscription(planType)}
          disabled={loadingPlan === planType}
          className="w-full py-3 px-6 bg-white text-blue-400 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loadingPlan === planType ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : "Subscribe Now"}
        </button>
      </div>
    </div>
  );
};

export default Subscribe;
