"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDeals, deleteDeal } from "../../../store/dealSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DealCard = ({ deal, onDelete }) => (
  <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white max-w-sm">
    {deal.image && (
      <img src={deal.image} alt={deal.title} className="w-full h-48 object-cover" />
    )}
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2">{deal.title}</h3>
      <p className="text-gray-700 mb-4">
        {deal.price ? `$${deal.price.toFixed(2)}` : "Price on request"}
        <span className="block text-sm text-gray-500 mt-1">
          Created: {new Date(deal.createdAt).toLocaleDateString()}
        </span>
      </p>
      <div className="flex space-x-2">
        {/* <Link href={`/deals/${deal.id}`}>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
            Read More
          </button>
        </Link> */}
        <Link href={`/admin/deals/edit/${deal.id}`}>
          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
            Edit
          </button>
        </Link>
        <button
          onClick={() => onDelete(deal.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default function AdminDeals() {
  const router = useRouter();
  const dispatch = useDispatch();
  const deals = useSelector((state) => state.deals.deals);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  // Admin check
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

  // Fetch deals
  useEffect(() => {
    if (!authChecked) return;

    const fetchDeals = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/deals");
        if (!res.ok) throw new Error("Failed to fetch deals");
        const data = await res.json();
        dispatch(setDeals(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, [dispatch, authChecked]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;
    try {
      const res = await fetch(`/api/deals/${id}`, { method: "DELETE" });
      if (res.ok) {
        dispatch(deleteDeal(id));
      } else {
        const errorData = await res.json();
        console.error("Delete failed:", errorData.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const filteredDeals = deals.filter((deal) =>
    deal.title.toLowerCase().includes(search.toLowerCase())
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
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <Link href={"/admin"} className="block">
            <li className="hover:text-blue-400 cursor-pointer">Dashboard</li>
          </Link>
          <Link href={"/admin/users"} className="block">
            <li className="hover:text-blue-400 cursor-pointer">Users</li>
          </Link>
          <Link href={"/admin/allblogs"} className="block">
            <li className="hover:text-blue-400 cursor-pointer">Blogs</li>
          </Link>
          <Link href={"/admin/deals"} className="block">
            <li className="hover:text-blue-400 cursor-pointer">Deals</li>
          </Link>
        </ul>
      </div>

      <div className="flex-1 p-10">
        <div className="flex justify-between items-center flex-col md:flex-row gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Manage <span className="text-blue-600">Deals</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Here you can search, edit, and delete deals.
            </p>
          </div>
          <div>
            <button
              onClick={() => router.push("/")}
              className="bg-[#4d37f0] text-white px-4 py-2 rounded mr-2"
            >
              Visit Site
            </button>
            <Link href="/admin/deals/addDeal">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Deal
              </button>
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Loading deals...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : filteredDeals.length === 0 ? (
          <p className="text-gray-500">No deals found</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
