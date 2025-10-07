"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const [formdata, setFormdata] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok && data.user) {
          dispatch(setUser(data.user));
          router.push("/"); 
        } else {
          setLoading(false); 
        }
      } catch {
        setLoading(false);
      }
    };
    checkUser();
  }, [dispatch, router]);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      dispatch(setUser(data.user));
      setFormdata({ email: "", password: "" });
      router.push("/"); 
    } catch {
      setError("Failed to connect to server");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formdata.email}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formdata.password}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 shadow-sm"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <button
          onClick={() => (window.location.href = "/api/auth/google")}
          className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl shadow-sm hover:bg-gray-50 transition duration-300 flex items-center justify-center gap-2"
        >
          <img src="/google.png" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
        <p className="text-sm text-gray-600 text-center mt-6">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="text-indigo-600 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
