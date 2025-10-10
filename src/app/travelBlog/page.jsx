"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/lib/sanity.client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { useRouter } from "next/navigation";

const builder = imageUrlBuilder(client);

const Blog = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await client.fetch(`*[_type=="post"] | order(publishedAt desc){
          _id,
          title,
          description,
          "slug": slug.current,
          mainImage,
          tags,
          "authorName": author->name,
          publishedAt
        }`);
        setBlogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center py-10">Loading blogs...</p>;
  if (blogs.length === 0)
    return <p className="text-center py-10 text-gray-500">No blogs found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-8 sm:mb-12">
        Travel <span className="text-blue-600">Blogs</span>
      </h1>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="p-4 sm:p-5 rounded-2xl shadow-md bg-white border border-gray-200 flex flex-col transition-all hover:shadow-xl cursor-pointer"
            onClick={() => router.push(`/travelBlog/${blog.slug}`)}
          >
            <div className="overflow-hidden rounded-xl aspect-[16/10]">
              {blog.mainImage && (
                <Image
                  src={builder.image(blog.mainImage).url()}
                  alt={blog.title}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover rounded-xl hover:scale-110 transition-transform duration-500"
                />
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-bold mt-3 sm:mt-4 text-gray-800 line-clamp-2">
              {blog.title}
            </h2>

            <p className="text-gray-600 mt-2 text-sm sm:text-base line-clamp-3">
              {blog.description}
            </p>

            <div className="mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/travelBlog/${blog.slug}`, "_blank", "noopener");
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
