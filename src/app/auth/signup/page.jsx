"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Signup = () => {
    const [formdata, setFormdata] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormdata({ ...formdata, [name]: value });

        if (name === "password") {
            validatePassword(value);
        }
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!regex.test(password)) {
            setPasswordError(
                "Password must be at least 8 characters, include one uppercase letter and one special character."
            );
        } else {
            setPasswordError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (passwordError) {
            setError(passwordError);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formdata),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Something went wrong");
            } else {
                alert("Signup successful!");
                router.push("/auth/login");
            }
        } catch (err) {
            setError("Failed to connect to server");
        }

        setFormdata({
            name: "",
            email: "",
            password: "",
        });
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Create an Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formdata.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="mt-1 w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formdata.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="mt-1 w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formdata.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="mt-1 w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                            required
                        />
                        {passwordError && (
                            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                        )}
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-sm text-gray-600 text-center mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
