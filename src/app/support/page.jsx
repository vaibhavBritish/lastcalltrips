"use client";

import React, { useState } from "react";
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Support = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleFAQ = (i) => setOpenIndex(openIndex === i ? -1 : i);

  // FAQ Data
  const faqCategories = [
    {
      title: "Subscription",
      icon: <FaQuestionCircle className="text-[#155dfc] text-xl" />,
      list: [
        { question: "How do I cancel my subscription?", ans: "You can cancel anytime through your account settings or by contacting our support team." },
        { question: "How do I subscribe?", ans: "Click the 'Subscribe' button at the top of our site, choose your plan, and follow the simple checkout steps." },
        { question: "How many deal notifications will I get?", ans: "We send only the best deals to our subscribers. Depending on your selected regions, you may receive 6–16 deals per month from major Canadian cities." },
        { question: "Why haven’t I received any deals?", ans: "If you’re not receiving deals, try selecting 'ALL' destinations in your preferences. We only send top flight deals to ensure quality over quantity." },
      ],
    },
    {
      title: "General",
      icon: <FaQuestionCircle className="text-[#155dfc] text-xl" />,
      list: [
        { question: "Can I select specific dates?", ans: "We don’t offer exact date selection. The more flexible your travel dates, the more deals you can access." },
        { question: "Do you offer hotel or vacation deals?", ans: "Occasionally, yes! Most of our focus is on flights to ensure the best savings." },
        { question: "Do you only provide deals from Canada?", ans: "Yes, currently we focus on Canadian departure cities but plan to expand internationally soon." },
        { question: "Do you post business class deals?", ans: "No, we focus on economy fares to maximize savings for our subscribers." },
        { question: "Which Canadian cities are covered?", ans: "Vancouver, Calgary, Edmonton, Toronto, Ottawa, Montreal, and Halifax." },
        { question: "How do I book a deal?", ans: "We provide clear booking instructions. You book directly with the airline or OTA." },
        { question: "How do I reset my password?", ans: "Click 'Forgot Password' at login or visit our password reset page." },
        { question: "How long do deals last?", ans: "Most deals last under 48 hours, some even shorter. Book as soon as possible!" },
        { question: "Is the app free?", ans: "Yes! Basic access is free. Subscriptions unlock instant notifications and customized alerts." },
        { question: "Are the deals legitimate?", ans: "Absolutely! All deals are verified before we share them with subscribers." },
        { question: "Subscriber vs non-subscriber benefits?", ans: "Subscribers: Instant notifications, customized deals, no ads. Non-subscribers: Weekly newsletter, deals with ads." },
        { question: "Why don’t I see my departure city?", ans: "Currently we only provide deals from Canadian cities. Ensure your city is selected in your preferences." },
      ],
    },
    {
      title: "Billing",
      icon: <FaQuestionCircle className="text-[#155dfc] text-xl" />,
      list: [
        { question: "I can’t update my payment method.", ans: "Please resubscribe using our latest billing system at lastcalltrip.com/subscribe and contact support for assistance." },
        { question: "What is your refund policy?", ans: "Cancel within 30 days for a full refund. After 30 days, refunds are handled on a case-by-case basis." },
        { question: "Will my subscription auto-renew?", ans: "Yes, subscriptions auto-renew unless canceled. Failed payments may pause your subscription." },
      ],
    },
    {
      title: "Technical",
      icon: <FaQuestionCircle className="text-[#155dfc] text-xl" />,
      list: [
        { question: "How do I download the app?", ans: "Search 'LastCallTrip' on Google Play or App Store to download." },
        { question: "Facebook login no longer works?", ans: "As of Sept 2023, Facebook login is disabled. Reset your password and log in with your email." },
        { question: "Not receiving emails?", ans: "Ensure notifications are enabled and your preferences are correct. Contact support if issues persist." },
        { question: "Not receiving push notifications?", ans: "Check your device settings and app notifications. iOS users need iOS 16.2+ for push alerts." },
        { question: "My subscription isn’t active?", ans: "Use the 'Restore Purchases' button in the app’s subscription page to reconnect your subscription." },
      ],
    },
    {
      title: "Still Have Questions?",
      icon: <FaQuestionCircle className="text-[#155dfc] text-xl" />,
      list: [
        { question: "I still have questions. How do I contact you?", ans: "Email us at support@lastcalltrip.com. We respond within 24 hours!" },
      ],
    },
  ];

  const [formData, setFormData] = useState({
    name: "", email: "", howCanWeHelp: "", description: "", subscription: "", howSubscribe: "", deviceType: ""
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setStatus(res.ok ? "✅ Submitted successfully!" : `❌ ${data.message}`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Something went wrong.");
    }
  };

  return (
    <div className="px-4 py-12 bg-gray-50 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#155dfc] mb-2">Need Help?</h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Browse our FAQs or contact our support team. We’re here to make your LastCallTrip experience smooth and enjoyable!
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* FAQ Section */}
        <div className="space-y-8">
          {faqCategories.map((category, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                {category.icon}
                <h2 className="text-2xl font-bold text-[#155dfc]">{category.title}</h2>
              </div>
              <div className="divide-y">
                {category.list.map((q, i) => (
                  <div key={i} className="py-3">
                    <button
                      onClick={() => toggleFAQ(idx * 100 + i)}
                      className="flex justify-between w-full font-medium text-gray-800 hover:text-indigo-600 transition duration-200">
                      {q.question}
                      <span>{openIndex === idx * 100 + i ? <FaChevronUp /> : <FaChevronDown />}</span>
                    </button>
                    {openIndex === idx * 100 + i && (
                      <p className="mt-2 text-gray-600">{q.ans}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#155dfc] mb-4 text-center">Contact Support</h2>
          <p className="text-gray-700 mb-6 text-center">
            Can’t find an answer? Fill out the form below and we’ll respond within 24 hours.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name*" className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-200" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email*" className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-200" />
            <select name="howCanWeHelp" value={formData.howCanWeHelp} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-200">
              <option value="">How can we help you?</option>
              <option value="cancel">Cancel Subscription</option>
              <option value="notifications">Not Receiving Notifications</option>
              <option value="subscription">Subscription Issues</option>
            </select>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Describe your issue*" className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-200"></textarea>
            
            <div>
              <label className="block text-sm font-medium mb-1">Do you have a subscription?</label>
              <div className="flex gap-4">
                <label><input type="radio" name="subscription" value="true" checked={formData.subscription === "true"} onChange={handleChange}/> Yes</label>
                <label><input type="radio" name="subscription" value="false" checked={formData.subscription === "false"} onChange={handleChange}/> No</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">How did you subscribe?</label>
              <div className="flex flex-col gap-2">
                <label><input type="radio" name="howSubscribe" value="stripe" checked={formData.howSubscribe === "stripe"} onChange={handleChange}/> Website Stripe</label>
                <label><input type="radio" name="howSubscribe" value="ios" checked={formData.howSubscribe === "ios"} onChange={handleChange}/> iOS</label>
                <label><input type="radio" name="howSubscribe" value="google" checked={formData.howSubscribe === "google"} onChange={handleChange}/> Google Play</label>
              </div>
            </div>

            <input type="text" name="deviceType" value={formData.deviceType} onChange={handleChange} placeholder="Device Type (iPhone 13, Galaxy S22, etc)" className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-200" />

            <button type="submit" className="w-full bg-[#155dfc] text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition duration-300">
              Submit
            </button>

            {status && <p className="text-center mt-2 text-gray-700">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;
