"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addDeal } from "../../../../store/dealSlice";

export default function AddDealForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [tags, setTags] = useState("");
  const [savings, setSavings] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Correct Base64 conversion
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) resolve(reader.result.toString());
        else reject("FileReader returned empty result");
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !imageFile || !price) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Convert the image to Base64
      const base64Image = await toBase64(imageFile);

      // Upload image via server API
      const uploadRes = await fetch("/api/deals/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64Image }),
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.message || "Image upload failed");
      }

      const imageUrl = uploadData.url;

      // Submit deal
      const payload = {
        title,
        description,
        price: parseFloat(price),
        image: imageUrl, // single image
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        savings: savings ? parseFloat(savings) : undefined,
      };

      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Failed to add deal");
      }

      const newDeal = await res.json();
      dispatch(addDeal(newDeal));

      setMessage(`Deal "${newDeal.title}" added successfully!`);
      setTitle("");
      setDescription("");
      setPrice("");
      setImageFile(null);
      setTags("");
      setSavings("");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Travel Deal</h2>

      {message && (
        <p
          className={`mb-4 ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Description *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          rows={4}
        />
        <input
          type="number"
          placeholder="Price ($) *"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          min="0"
          step="0.01"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Savings ($)"
          value={savings}
          onChange={(e) => setSavings(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          min="0"
          step="0.01"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Deal"}
        </button>
      </form>
    </div>
  );
}
