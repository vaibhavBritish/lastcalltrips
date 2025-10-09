"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, deleteUser, updateUser } from "@/store/userSlice";
import Link from "next/link";

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const USERS_PER_PAGE = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        dispatch(setUsers(data.users));
      }
    };
    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    const fetchSubscribedUsers = async () => {
      const res = await fetch("/api/users/subscribed");
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscribedUsers);
      }
    };
    fetchSubscribedUsers();
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) dispatch(deleteUser(id));
  };

  const handleToggleRole = async (id, isAdmin) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAdmin: !isAdmin }),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(updateUser(data.user));
    }
  };

  const getSubscriptionInfo = (userId) => {
    const sub = subscriptions.find((s) => s.userId === userId);
    if (sub) {
      return {
        plan: sub.plan,
        status: sub.status,
        date: new Date(sub.createdAt),
        formattedDate: new Date(sub.createdAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };
    }
    return null;
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const sub = getSubscriptionInfo(u.id);
      const matchesSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      if (filter === "subscribed") return sub && matchesSearch;
      if (filter === "nonsubscribed") return !sub && matchesSearch;
      return matchesSearch;
    });
  }, [users, subscriptions, search, filter]);


  const sortedUsers = useMemo(() => {
    const sortable = [...filteredUsers];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const subA = getSubscriptionInfo(a.id);
        const subB = getSubscriptionInfo(b.id);

        let aValue, bValue;

        switch (sortConfig.key) {
          case "name":
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case "email":
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
            break;
          case "role":
            aValue = a.isAdmin ? "admin" : "user";
            bValue = b.isAdmin ? "admin" : "user";
            break;
          case "plan":
            aValue = subA?.plan || "";
            bValue = subB?.plan || "";
            break;
          case "status":
            aValue = subA?.status || "";
            bValue = subB?.status || "";
            break;
          case "date":
            aValue = subA?.date ? subA.date.getTime() : 0;
            bValue = subB?.date ? subB.date.getTime() : 0;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredUsers, sortConfig, subscriptions]);

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / USERS_PER_PAGE);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) return sortConfig.direction === "asc" ? "↑" : "↓";
    return "↕";
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <Link href="/admin" className="block">
            <li className="hover:text-blue-400 cursor-pointer">Dashboard</li>
          </Link>
          <Link href="/admin/users" className="block">
            <li className="hover:text-blue-400 cursor-pointer">Users</li>
          </Link>
          <Link href="/admin/allblogs" className="block">
            <li className="hover:text-blue-400 cursor-pointer">Blogs</li>
          </Link>
          <Link href="/admin/deals" className="block">
            <li className="hover:text-blue-400 cursor-pointer">Deals</li>
          </Link>
        </ul>
      </div>


      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Manage <span className="text-blue-600">Users</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Add, update, or delete users from the system.
            </p>
          </div>
          <Link href="/">
            <button className="bg-[#4d37f0] text-white px-4 py-2 rounded">
              Visit Site
            </button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <label htmlFor="filter" className="text-gray-700 font-medium">
              Filter:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 bg-white"
            >
              <option value="all">All Users</option>
              <option value="subscribed">Subscribed Users</option>
              <option value="nonsubscribed">Non-Subscribed Users</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
          />
        </div>


        <div className="mb-4 text-gray-700 font-medium">
          Showing {filteredUsers.length} of {users.length} users
        </div>

    
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full border border-gray-200 rounded">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th
                  className="p-2 border cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  Name {getSortIndicator("name")}
                </th>
                <th
                  className="p-2 border cursor-pointer"
                  onClick={() => requestSort("email")}
                >
                  Email {getSortIndicator("email")}
                </th>
                <th
                  className="p-2 border cursor-pointer"
                  onClick={() => requestSort("role")}
                >
                  Role {getSortIndicator("role")}
                </th>
                <th
                  className="p-2 border cursor-pointer"
                  onClick={() => requestSort("plan")}
                >
                  Plan {getSortIndicator("plan")}
                </th>
                <th
                  className="p-2 border cursor-pointer"
                  onClick={() => requestSort("status")}
                >
                  Status {getSortIndicator("status")}
                </th>
                <th
                  className="p-2 border cursor-pointer"
                  onClick={() => requestSort("date")}
                >
                  Subscribed On {getSortIndicator("date")}
                </th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => {
                const sub = getSubscriptionInfo(u.id);
                return (
                  <tr key={u.id} className="text-center border-b">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">
                      {u.isAdmin ? (
                        <span className="text-purple-600 font-semibold">Admin</span>
                      ) : (
                        "User"
                      )}
                    </td>
                    <td className="p-2">{sub ? sub.plan : "—"}</td>
                    <td
                      className={`p-2 font-semibold ${
                        sub?.status === "ACTIVE"
                          ? "text-green-600"
                          : sub
                          ? "text-yellow-600"
                          : "text-gray-500"
                      }`}
                    >
                      {sub ? sub.status : "Not Subscribed"}
                    </td>
                    <td className="p-2">{sub ? sub.formattedDate : "—"}</td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        onClick={() => handleToggleRole(u.id, u.isAdmin)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        {u.isAdmin ? "Revoke Admin" : "Make Admin"}
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200"
                  : "text-blue-600 border-blue-300 hover:bg-blue-100"
              }`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded border ${
                  page === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200"
                  : "text-blue-600 border-blue-300 hover:bg-blue-100"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;