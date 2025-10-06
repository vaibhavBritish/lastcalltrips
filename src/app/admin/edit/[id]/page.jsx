"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const EditBlogPage = () => {
    const { id } = useParams();

    const router = useRouter()
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

    useEffect(() => {
        if (!authChecked) return;

    }, [authChecked]);


    const [form, setForm] = useState({
        title: "",
        description: "",
        content: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/blog/by-id/${id}`);
                if (!res.ok) throw new Error("Blog not found");
                const data = await res.json();

                setForm({
                    title: data.blog.title || "",
                    description: data.blog.description || "",
                    content: data.blog.content || "",
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBlog();
    }, [id]);


    const handleChange = (
        e
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/blog/by-id/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Failed to update blog");

            router.push("/admin/allblogs");
        } catch (error) {
            console.error(error);
        }
    };

    if (!authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Verifying admin access...</p>
            </div>
        );
    }


    if (loading) return <p>Loading blog...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-2xl">
            <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border rounded-lg px-3 py-2"
                />
                <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full border rounded-lg px-3 py-2"
                />
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Content"
                    className="w-full border rounded-lg px-3 py-2 min-h-[150px]"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditBlogPage;
