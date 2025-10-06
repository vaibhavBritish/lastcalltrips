import React from "react";
import SubscriptionRequired from "../profile/SubscriptionRequired";
import prisma from "../../../prisma/client";

// Server-side fetch
async function getDeals() {
  return prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default function DealsPageWrapper() {
  return <DealsPage />;
}

// Async Server Component
async function DealsPage() {
  const travelDeals = await getDeals();

  return (
    <SubscriptionRequired>
      <div className="p-8 min-h-screen bg-gray-50">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          Premium Travel Deals of the Month
        </h1>

        {travelDeals.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">
            No deals available at the moment. Please check back later!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {travelDeals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover transition duration-500 hover:opacity-90"
                  />
                </div>

                <div className="p-5">
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{deal.title}</h2>

                  {/* Price */}
                  <div className="flex items-end mb-3">
                    <p className="text-3xl font-extrabold text-indigo-600">
                      {deal.price !== null ? `$${deal.price.toFixed(2)}` : "Price N/A"}
                    </p>
                    <span className="text-sm font-medium text-gray-500 ml-2">/ per person</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4">{deal.description}</p>

                  {/* Tags */}
                  {deal.tags && deal.tags.length > 0 && (
                    <div className="mb-4">
                      {deal.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full mr-2"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Savings & Book Button */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    {deal.savings !== null && (
                      <p className="text-md font-bold text-green-600">
                        Save ${deal.savings.toFixed(2)}
                      </p>
                    )}
                    <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SubscriptionRequired>
  );
}
