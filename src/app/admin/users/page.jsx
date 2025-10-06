"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, deleteUser, updateUser } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AdminUsersPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const users = useSelector((state) => state.users.users);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch("/api/users");
            if (res.ok) {
                const data = await res.json();
                dispatch(setUsers(data.users));
            }
        };
        fetchUsers();
    }, [dispatch]);

    const handleDelete = async (id) => {
        const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (res.ok) dispatch(deleteUser(id));
    };

    const handleToggleRole = async (id, isAdmin) => {
        const res = await fetch(`/api/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isAdmin: !isAdmin }),
        });
        if (res.ok) {
            const data = await res.json();
            dispatch(updateUser(data.user));
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            <div className="w-64 bg-gray-800 text-white p-5">
                <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                <ul className="space-y-4">
                   <Link href="/admin" className="block"><li className="hover:text-blue-400 cursor-pointer">Dashboard</li></Link>

                    <Link href={"/admin/users"} className="block"><li className="hover:text-blue-400 cursor-pointer">Users</li></Link>
                    <Link href={"/admin/allblogs"} className="block"><li className="hover:text-blue-400 cursor-pointer">Blogs</li></Link>
                    <Link href={"/admin/deals"} className='block'><li className="hover:text-blue-400 cursor-pointer">Deals</li></Link>

                </ul>
            </div>

            <div className="flex-1 p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Manage <span className="text-blue-600">Users</span>
                        </h1>
                        <p className="mt-2 text-gray-600">Add, update, or delete users from the system.</p>
                    </div>
                    <Link href = {"/"}><button
                        
                        className="bg-[#4d37f0] text-white px-4 py-2 rounded"
                    >
                        Visit Site
                    </button></Link>
                </div>

                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="w-full border border-gray-200 rounded">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="p-2 border">ID</th>
                                <th className="p-2 border">Name</th>
                                <th className="p-2 border">Email</th>
                                <th className="p-2 border">Role</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="text-center border-b">
                                    <td className="p-2">{u.id}</td>
                                    <td className="p-2">{u.name}</td>
                                    <td className="p-2">{u.email}</td>
                                    <td className="p-2">{u.isAdmin ? "Admin" : "User"}</td>
                                    <td className="p-2 flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleToggleRole(u.id, u.isAdmin)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded"
                                        >
                                            {u.isAdmin ? "Revoke Admin" : "Make Admin"}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;
