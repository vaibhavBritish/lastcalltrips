"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBlogs } from "../../store/blogSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const Blog = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogs);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        dispatch(setBlogs(data.blogs));
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchBlogs();
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-8 sm:mb-12">
        Travel <span className="text-blue-600">Blogs</span>
      </h1>


      {loading ? (
        <p className="text-gray-500 text-center text-base sm:text-lg">
          Loading blogs...
        </p>
      ) : blogs.length === 0 ? (

        <p className="text-gray-500 text-center text-base sm:text-lg">
          No blogs found
        </p>
      ) : (
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="p-4 sm:p-5 rounded-2xl shadow-md bg-white border border-gray-200 flex flex-col transition-all hover:shadow-xl"
            >
              <div className="overflow-hidden rounded-xl aspect-[16/10]">
                <Image
                  src={blog.image[0]}
                  alt={blog.title}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover rounded-xl hover:scale-110 transition-transform duration-500"
                />
              </div>

              <h2 className="text-lg sm:text-xl font-bold mt-3 sm:mt-4 text-gray-800 line-clamp-2">
                {blog.title}
              </h2>

              <p className="text-gray-600 mt-2 text-sm sm:text-base line-clamp-3">
                {blog.description}
              </p>

              <button
                onClick={() => router.push(`/travelBlog/${blog.slug}`)}
                className="mt-4 sm:mt-5 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all text-sm sm:text-base"
              >
                Read More →
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
