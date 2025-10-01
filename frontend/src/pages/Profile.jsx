
import React, { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

export default function Profile() {
    const { backend_url, logout, navigate } = useContext(ShopContext);
    const base = (backend_url || "").replace(/\/$/, "");

    const apiAuth = useMemo(
        () => axios.create({ baseURL: base, withCredentials: true }),
        [base]
    );

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setErr("");
            try {
                const { data } = await apiAuth.get("/api/v1/users/me");
                if (!cancelled) setUser(data?.data?.user || null);
            } catch (e) {
                if (e?.response?.status === 401) {
                    try {
                        await apiAuth.post("/api/v1/users/refresh-token", {});
                        const { data } = await apiAuth.get("/api/v1/users/me");
                        if (!cancelled) setUser(data?.data?.user || null);
                    } catch {
                        if (!cancelled) setErr("Please sign in to view your profile.");
                    }
                } else {
                    if (!cancelled) setErr("Unable to load your profile.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [apiAuth]);

    if (loading) return <div className="p-6">Loading…</div>;
    if (err || !user) {
        return (
            <div className="max-w-md mx-auto p-6 text-center">
                <h1 className="text-2xl font-semibold mb-2">You’re not signed in</h1>
                <p className="text-gray-600 mb-6">{err || "Please log in to see your profile."}</p>
                <Link to="/login" className="inline-block bg-[#07414e] hover:bg-[#0C586A] text-white px-4 py-2 rounded">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="hover:scale-95 duration-300 max-w-md mx-auto mt-10 p-6 rounded-2xl shadow border border-gray-100">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#07414e] text-white grid place-items-center text-xl font-semibold">
                    {(user.name || user.email || "?").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div>
                    <h1 className="text-xl font-semibold">{user.name || "User"}</h1>
                    <p className="text-gray-600">{user.email || "—"}</p>
                </div>
            </div>

            <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between border-b py-2">
                    <span className="text-gray-500">Joined</span>
                    <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                    <span className="text-gray-500">Role</span>
                    <span>{user.role || "Customer"}</span>
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <button onClick={() => navigate("/")} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">
                    Back to Home
                </button>
                <button onClick={logout} className="px-4 py-2 rounded bg-[#07414e] hover:bg-[#0C586A] text-white">
                    Logout
                </button>
            </div>
        </div>
    );
}
