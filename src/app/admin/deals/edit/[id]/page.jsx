"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function EditDealPage({ params }) {
  const router = useRouter();

  const { id } = use(params);

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [savings, setSavings] = useState("");
  const [imageFile, setImageFile] = useState(null);


  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const res = await fetch(`/api/deals/${id}`);
        if (!res.ok) throw new Error("Deal not found");
        const data = await res.json();
        setDeal(data);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price?.toString() || "");
        setTags(data.tags?.join(",") || "");
        setSavings(data.savings?.toString() || "");
      } catch (err) {
        console.error(err);
        setMessage("Failed to load deal");
      } finally {
        setLoading(false);
      }
    };
    fetchDeal();
  }, [id]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => (reader.result ? resolve(reader.result.toString()) : reject("No result"));
      reader.onerror = (err) => reject(err);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageUrl = deal?.image;

      if (imageFile) {
        const base64 = await toBase64(imageFile);
        const uploadRes = await fetch("/api/deals/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64 }),
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.url) throw new Error("Image upload failed");
        imageUrl = uploadData.url;
      }

      const payload = {
        title,
        description,
        price: parseFloat(price),
        tags: tags.split(",").map((t) => t.trim()),
        savings: savings ? parseFloat(savings) : undefined,
        image: imageUrl,
      };

      const res = await fetch(`/api/deals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update deal");

      router.push("/admin/deals");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!deal) return <p>Deal not found.</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Deal</h2>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
          rows={4}
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="number"
          value={savings}
          onChange={(e) => setSavings(e.target.value)}
          placeholder="Savings"
          className="w-full border px-3 py-2 rounded"
        />

        <div>
          <label className="block mb-1">Current Image:</label>
          {deal.image && (
            <img src={deal.image} alt="Current Deal" className="w-32 h-32 object-cover mb-2 rounded" />
          )}
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Deal"}
        </button>
      </form>
    </div>
  );
}
