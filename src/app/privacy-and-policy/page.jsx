import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Last updated: September 27, 2025
        </p>

        {/* Intro */}
        <p className="text-gray-700 mb-8">
          At <span className="font-semibold">LastCallTrips</span>, your privacy
          is very important to us. This Privacy Policy explains how we collect,
          use, and protect your personal information when you use our services.
          By using our website, you agree to the terms outlined here.
        </p>

        {/* Sections */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              1. Information We Collect
            </h2>
            <p className="text-gray-700">
              We may collect the following types of information:
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>Personal details (name, email, phone number, address)</li>
              <li>Payment and billing information</li>
              <li>
                Travel preferences, booking details, and communication history
              </li>
              <li>Device information (IP address, browser, cookies)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700">We use your information to:</p>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>Provide and improve our travel booking services</li>
              <li>Process payments securely</li>
              <li>Send booking confirmations, updates, and promotions</li>
              <li>Respond to customer inquiries and support requests</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              3. Sharing of Information
            </h2>
            <p className="text-gray-700">
              We do not sell your personal information. However, we may share it
              with:
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>Trusted travel partners and service providers</li>
              <li>Payment gateways for transaction processing</li>
              <li>Legal authorities, if required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              4. Data Security
            </h2>
            <p className="text-gray-700">
              We implement strong technical and organizational measures to
              safeguard your data. However, no method of online transmission is
              100% secure, and we cannot guarantee absolute protection.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              5. Cookies
            </h2>
            <p className="text-gray-700">
              Our website uses cookies to enhance your browsing experience,
              analyze traffic, and personalize content. You can manage cookies
              through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              6. Your Rights
            </h2>
            <p className="text-gray-700">
              You have the right to access, update, or delete your personal
              information. You may also opt-out of promotional emails at any
              time by following the unsubscribe link.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              7. Changes to This Policy
            </h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with the updated date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              8. Contact Us
            </h2>
            <p className="text-gray-700">
              If you have any questions or concerns about this Privacy Policy,
              please contact us at:
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

export default PrivacyPolicy;
