"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Admin = () => {

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



    const [error, setError] = useState(null);
    const [formdata, setFormdata] = useState({
        title: "",
        description: "",
        content: "",
        author: "",
        tags: "",
        isPublished: false,
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormdata({ ...formdata, [name]: checked });
        } else if (type === "file") {
            setFormdata({ ...formdata, [name]: files[0] });
        } else {
            setFormdata({ ...formdata, [name]: value });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormdata({ ...formdata, image: [reader.result] });
        };
        reader.readAsDataURL(file);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formdata,
                    tags: formdata.tags.split(",").map((t) => t.trim()),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                return;
            }

            setFormdata({
                title: "",
                description: "",
                content: "",
                author: "",
                tags: "",
                isPublished: false,
                image: null,
            });
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        }
    };


    if (!authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Verifying admin access...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    Create Blog Post
                </h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formdata.title}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>


                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formdata.description}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Content</label>
                        <textarea
                            name="content"
                            value={formdata.content}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
                            required
                        />
                    </div>


                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Author</label>
                        <input
                            type="text"
                            name="author"
                            value={formdata.author}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>


                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Tags (comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formdata.tags}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>


                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formdata.isPublished}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                        />
                        <label className="text-gray-700">Publish immediately</label>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="w-full border rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                    >
                        Submit Blog
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Admin;
