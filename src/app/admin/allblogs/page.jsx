"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBlogs, deleteBlog as removeBlog } from "../../../store/blogSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const AllBlogs = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogs);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 6;
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

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/blog?page=${page}&limit=${limit}`);
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        dispatch(setBlogs(data.blogs));
        setTotal(data.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page, dispatch, authChecked]);

  const handleDeleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`/api/blog/by-id/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        dispatch(removeBlog(id));
      } else {
        const errorData = await res.json();
        console.error("Delete failed:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleAddBlog = () => {
    router.push("/admin/createBlog");
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Verifying admin access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      <div className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <Link href={"/admin"} className="block"><li className="hover:text-blue-400 cursor-pointer">Dashboard</li></Link>
          <Link href={"/admin/users"} className="block"><li className="hover:text-blue-400 cursor-pointer">Users</li></Link>
          <Link href={"/admin/allblogs"} className="block"><li className="hover:text-blue-400 cursor-pointer">Blogs</li></Link>
          <Link href={"/admin/deals"} className='block'><li className="hover:text-blue-400 cursor-pointer">Deals</li></Link>

        </ul>
      </div>

      <div className="flex-1 p-10">
        <div className="flex justify-between items-center flex-col md:flex-row gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Manage <span className="text-blue-600">Blogs</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Here you can search, edit, and delete blogs.
            </p>
          </div>
          <div>
            <button
              onClick={() => router.push("/")}
              className="bg-[#4d37f0] text-white px-4 py-2 rounded mr-2"
            >
              Visit Site
            </button>
            <button
              onClick={handleAddBlog}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Blog
            </button>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>


        {loading ? (
          <p className="text-gray-500">Loading blogs...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-gray-500">No blogs found</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="p-6 rounded-2xl shadow-lg bg-white border hover:shadow-2xl transition duration-300"
              >
                <div className="mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={blog.image?.[0] || "/fallback.jpg"}
                    alt={blog.title}
                    width={400}
                    height={250}
                    className="object-cover w-full h-48 transform hover:scale-105 transition duration-300"
                  />
                </div>
                <h2 className="text-xl font-semibold line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                  {blog.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => router.push(`/admin/allblogs/${blog.slug}`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Read More
                  </button>
                  <button
                    onClick={() => router.push(`/admin/edit/${blog.id}`)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {total > limit && (
          <div className="flex justify-center space-x-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              disabled={page === Math.ceil(total / limit)}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;
