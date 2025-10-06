"use client";
import { div } from 'framer-motion/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);


    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    if (!data.user || !data.user.isAdmin) {
                        router.push("/auth/login?message=Admin access required");
                        return;
                    }
                } else {
                    router.push("/auth/login?message=Please login first");
                    return;
                }
            } catch (err) {
                console.error("Admin check failed:", err);
                router.push("/auth/login?message=Authentication error");
                return;
            }
            setAuthChecked(true);
        };

        checkAdminAccess();
    }, [router]);

    if (!authChecked) {
        return (
            <div className='min-h-screen flex justify-center items-center'>
                <p className='text-gray-500'>Verifying admin access</p>
            </div>
        )
    }
    return (
        <div className="min-h-screen flex bg-gray-100">
            <div className="w-64 bg-gray-800 text-white p-5">
                <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                <ul className="space-y-4">
                    <Link href={"/admin"} className='block'><li className="hover:text-blue-400 cursor-pointer">Dashboard</li></Link>
                    <Link href={"/admin/users"} className='block'><li className="hover:text-blue-400 cursor-pointer">Users</li></Link>
                    <Link href={"/admin/allblogs"} className='block'><li className="hover:text-blue-400 cursor-pointer">Blogs</li></Link>
                    <Link href={"/admin/deals"} className='block'><li className="hover:text-blue-400 cursor-pointer">Deals</li></Link>
                </ul>
            </div>

            <div className="flex-1 p-10 flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Welcome to <span className="text-blue-600">Admin Dashboard</span>
                    </h1>
                    <p className="mt-4 text-gray-600">Here you can manage users, blogs.</p>
                </div>
                <div>
                    <Link href="/"><button className='bg-[#4d37f0] text-white px-4 py-2 rounded'>Visit Site</button></Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
