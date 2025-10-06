import React from "react";

interface ClickToCallFABProps {
  phoneNumber: string;
}

const ClickToCallFAB: React.FC<ClickToCallFABProps> = ({ phoneNumber }) => {
  const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");

  if (!cleanNumber) return null;

  return (
    <a
      href={`tel:${cleanNumber}`}
      aria-label={`Call ${phoneNumber}`}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="currentColor"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM7.4 5h1.2c.15.75.38 1.47.69 2.16L7.54 8.5C7.23 7.82 7.01 7.11 6.86 6.36c.09-.43.14-.87.14-1.36zM19 16.63c-.71.32-1.42.54-2.17.69l1.37 1.37c.71-.34 1.4-.59 2.08-.85.45.1.88.15 1.35.15v-1.2h-.01c-.48 0-.9-.05-1.32-.15z" />
      </svg>
    </a>
  );
};

export default ClickToCallFAB;
