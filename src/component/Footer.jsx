import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#545a65] text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">


        <div className="flex items-center space-x-3">
          <Image
            src="/lastcalltrips.png"
            alt="Company Logo"
            width={160}
            height={50}
            className="h-36 w-auto object-contain"
          />
        </div>

        <nav>
          <ul className="flex flex-wrap gap-8 text-sm font-medium">
            {[
              { label: "About", href: "/about" },
              { label: "Blog", href: "/travelBlog" },
              { label: "Help", href: "/support" },
              { label: "Disclaimer", href: "/disclaimer" },
              { label: "Privacy and Policy", href: "/privacy-and-policy" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="relative group transition"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-xs text-white text-center md:text-right">
          © {new Date().getFullYear()} All rights reserved | Last Call Trips
        </div>
      </div>
    </footer>
  );
};

export default Footer;
