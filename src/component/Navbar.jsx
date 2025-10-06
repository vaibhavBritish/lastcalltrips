"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiPhone,
} from "react-icons/fi";
import { useAuth } from "../lib/AuthContext"; 
import Image from "next/image";

const Navbar = () => {
  const { user, setUser } = useAuth(); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user); 
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [setUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setDropdownOpen(false);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const baseNavItems = [
    { href: "/story", label: "Our Story" },
    { href: "/travelBlog", label: "Travel Blog" },
    { href: "/support", label: "Support" },
  ];

  let navItems = [...baseNavItems];

  if (user && user.isSubscribed) {
    navItems.push(
      { href: "/profile", label: "Profile" }, 
      { href: "/deals", label: "Deals" }   
    );
  } else if (user) {
    navItems.push({ href: "/subscribe", label: "Subscribe" });
  } else {
    navItems.push({ href: "/subscribe", label: "Subscribe" });
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/70 backdrop-blur-md text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/lastcalltrips.png"
            alt="Last Call Trips Logo"
            width={400}
            height={100}
            className="w-32 object-contain"
            priority
          />
        </Link>


        <ul className="hidden md:flex space-x-10 text-base font-semibold">
          {navItems.map((item) => ( 
            <li key={item.href}>
              <Link
                href={item.href}
                className="relative py-2 transition-colors duration-200 hover:text-indigo-400 group"
              >
                {item.label}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>


        <div className="hidden md:flex items-center space-x-6">

          <a
            href="tel:+18337471983"
            className="flex items-center space-x-2 text-white hover:text-indigo-300 font-semibold"
          >
            <FiPhone className="text-lg" />
            <span>+1 (833) 747-1983</span>
          </a>

     
          {!user ? (
            <>
              <Link
                href="/auth/login"
                className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 text-base"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-base"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
           
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-5 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-200 font-medium border border-gray-600 hover:border-gray-500 min-w-[160px] text-base"
              >
                <FiUser className="text-lg" />
                <span className="truncate max-w-[100px]">{user.name}</span>
                <FiChevronDown
                  className={`text-sm transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <span
                      className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                        user.isSubscribed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isSubscribed ? " Member" : " User"}
                    </span>
                  </div>

                  {user.isSubscribed && (
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 group"
                    >
                      <FiUser className="mr-3 text-lg group-hover:text-indigo-600" />
                      <span className="font-medium">My Profile</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 group"
                  >
                    <FiLogOut className="mr-3 text-lg group-hover:text-red-600" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-3xl focus:outline-none p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 animate-slideDown">
          <div className="px-6 py-5 space-y-5">
            <ul className="flex flex-col space-y-4 text-base font-semibold">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 hover:text-indigo-400 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-700 pt-4">
              <a
                href="tel:+18337471983"
                className="flex items-center space-x-2 text-white hover:text-indigo-300 font-semibold"
              >
                <FiPhone className="text-lg" />
                <span>+1 (833) 747-1983</span>
              </a>
            </div>

            <div className="border-t border-gray-700 pt-4">
              {!user ? (
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/auth/login"
                    className="px-4 py-3 rounded-lg bg-gray-600 hover:bg-gray-500 transition-all duration-200 text-center font-medium text-base"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 text-center font-medium shadow-md text-base"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="px-4 py-3 bg-gray-700 rounded-lg">
                    <p className="font-medium text-white truncate text-base">
                      Welcome, {user.name}
                    </p>
                    <p className="text-xs text-gray-300 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-500 transition-all duration-200 font-medium shadow-md group text-base"
                  >
                    <FiLogOut className="mr-2 text-lg group-hover:rotate-12 transition-transform duration-200" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
