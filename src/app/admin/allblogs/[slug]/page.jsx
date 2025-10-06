"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const BlogBySlug = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!authChecked) return;
  }, [authChecked]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        setBlog(data.blog);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBlog();
  }, [slug]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Verifying admin access...</p>
      </div>
    );
  }

  if (loading) return <p className="text-center py-10">⏳ Loading blog...</p>;
  if (!blog) return <p className="text-center py-10 text-red-500">❌ Blog not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
        {blog.title}
      </h1>


      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-6">
        <span>✍️ {blog.author || "Unknown Author"}</span>
        <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
        {blog.tags?.length > 0 && (
          <div className="flex gap-2">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl shadow-lg mb-8">
        <Image
          src={blog.image[0]}
          alt={blog.title}
          width={900}
          height={600}
          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <p className="text-lg text-gray-600 leading-relaxed mb-8 text-center">
        {blog.description}
      </p>

      <div className="prose lg:prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-xl">
        {blog.content}
      </div>
    </div>
  );
};

export default BlogBySlug;
