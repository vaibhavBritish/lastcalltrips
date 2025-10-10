"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client } from "@/lib/sanity.client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

const BlogBySlug = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "post" && slug.current == $slug][0]{
            title,
            description,
            body,
            "authorName": author->name,
            mainImage,
            tags,
            publishedAt
          }`,
          { slug }
        );
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBlog();
  }, [slug]);

  if (loading)
    return <p className="text-center py-10 text-gray-500">⏳ Loading blog...</p>;

  if (!blog)
    return (
      <p className="text-center py-10 text-red-500 font-medium">
        ❌ Blog not found
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 overflow-x-hidden">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
        {blog.title}
      </h1>

      {/* Meta info */}
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-6">
        <span>✍️ {blog.authorName || "Unknown Author"}</span>
        {blog.publishedAt && (
          <span>📅 {new Date(blog.publishedAt).toLocaleDateString()}</span>
        )}
        {blog.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap justify-center">
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

      {/* Main image */}
      {blog.mainImage && (
        <div className="overflow-hidden rounded-2xl shadow-lg mb-8">
          <Image
            src={builder.image(blog.mainImage).width(900).height(600).url()}
            alt={blog.title}
            width={900}
            height={600}
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Description */}
      <p className="text-lg text-gray-600 leading-relaxed mb-8 text-justify break-words whitespace-pre-wrap">
        {blog.description}
      </p>

      {/* Body content */}
      <div className="prose lg:prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-xl text-justify break-words whitespace-pre-wrap">
        <PortableText value={blog.body} />
      </div>
    </div>
  );
};

export default BlogBySlug;
