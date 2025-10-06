import React from "react";

const Disclaimer = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Disclaimer
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Last updated: September 27, 2025
        </p>

        {/* Intro */}
        <p className="text-gray-700 mb-8">
          The information provided by <span className="font-semibold">LastCallTrips</span> 
          (“Company”, “we”, “our”, or “us”) on our website and through our services 
          is for general informational purposes only. By using our platform, you acknowledge 
          and agree to the terms outlined in this Disclaimer.
        </p>

        {/* Sections */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              1. No Guarantees
            </h2>
            <p className="text-gray-700">
              While we strive to provide accurate, up-to-date travel information and 
              affordable deals, we make no warranties or guarantees regarding the 
              availability, pricing, accuracy, or completeness of the information 
              presented on our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              2. Third-Party Services
            </h2>
            <p className="text-gray-700">
              Our website may contain links or references to third-party services 
              such as airlines, hotels, or travel agencies. We do not control or 
              endorse these third parties and are not responsible for the content, 
              accuracy, or reliability of their services. Any transactions you make 
              with third-party providers are at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              3. Limitation of Liability
            </h2>
            <p className="text-gray-700">
              Under no circumstances shall LastCallTrips be held liable for any 
              direct, indirect, incidental, or consequential damages resulting from 
              the use of our website, booking services, or reliance on the 
              information provided. You agree to use our services at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              4. Travel Risks
            </h2>
            <p className="text-gray-700">
              Traveling involves inherent risks, including but not limited to 
              delays, cancellations, health concerns, and safety issues. LastCallTrips 
              is not responsible for such risks, and travelers are encouraged to 
              exercise caution, check official advisories, and obtain appropriate 
              insurance before traveling.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              5. No Professional Advice
            </h2>
            <p className="text-gray-700">
              The content on our website does not constitute professional travel, 
              legal, financial, or medical advice. You should seek independent advice 
              from qualified professionals before making any travel-related decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              6. Changes to Disclaimer
            </h2>
            <p className="text-gray-700">
              We reserve the right to update, modify, or change this Disclaimer at 
              any time without prior notice. Updates will be reflected with a new 
              “Last updated” date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              7. Contact Us
            </h2>
            <p className="text-gray-700">
              If you have questions regarding this Disclaimer, please contact us:
            </p>
            <p className="text-gray-700 mt-2">
              📧 Email:{" "}
              <a
                href="mailto:support@lastcalltrips.com"
                className="text-blue-600 hover:underline"
              >
                support@lastcalltrips.com
              </a>
            </p>
            <p className="text-gray-700">📍 Address: Toronto, Canada</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
