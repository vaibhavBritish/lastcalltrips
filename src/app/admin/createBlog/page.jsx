"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { client } from "@/lib/sanity.client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

const Admin = () => {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState(null);
  const [formdata, setFormdata] = useState({
    title: "",
    description: "",
    content: "",
    author: "", // optional
    tags: "",
    isPublished: false,
    image: null,
  });

  useEffect(() => {
    // Mock admin auth check
    const checkAdminAccess = async () => {
      // You can implement your auth check here
      setAuthChecked(true);
    };
    checkAdminAccess();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") setFormdata({ ...formdata, [name]: checked });
    else if (type === "file") setFormdata({ ...formdata, image: files[0] });
    else setFormdata({ ...formdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("title", formdata.title);
      payload.append("description", formdata.description);
      payload.append("content", formdata.content);
      payload.append("tags", formdata.tags);
      payload.append("isPublished", formdata.isPublished);
      if (formdata.image) payload.append("image", formdata.image);

      const res = await fetch("/api/blog", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create blog");

      alert("Blog created successfully!");
      setFormdata({
        title: "",
        description: "",
        content: "",
        author: "",
        tags: "",
        isPublished: false,
        image: null,
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (!authChecked)
    return <p className="text-center py-10 text-gray-500">Checking access...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Blog Post
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            value={formdata.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <input
            type="text"
            name="description"
            value={formdata.description}
            onChange={handleChange}
            placeholder="Short Description"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <textarea
            name="content"
            value={formdata.content}
            onChange={handleChange}
            rows={10}
            placeholder="Write your blog here. Use line breaks for new paragraphs."
            className="w-full border rounded-lg px-4 py-2 resize-none"
            required
          />
          <input
            type="text"
            name="tags"
            value={formdata.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full border rounded-lg px-4 py-2"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={formdata.isPublished}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label>Publish immediately</label>
          </div>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Submit Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
