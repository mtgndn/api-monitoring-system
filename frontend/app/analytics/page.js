"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function AnalyticsPage() {
  const [apiKey, setApiKey] = useState("");
  const [topEndpoints, setTopEndpoints] = useState([]);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔐 API KEY CHECK
  useEffect(() => {
    const key = localStorage.getItem("apiKey");

    if (!key) {
      router.push("/settings");
    } else {
      setApiKey(key);
    }
  }, [router]);

  // 📊 FETCH DATA
  useEffect(() => {
    if (!apiKey) return;

    const fetchData = async () => {
      try {
        const headers = { "x-api-key": apiKey };

        const [topRes, dailyRes] = await Promise.all([
          axios.get(`${API_URL}/analytics/top-endpoints`, { headers }),
          axios.get(`${API_URL}/analytics/daily`, { headers })
        ]);

        setTopEndpoints(topRes.data || []);
        setDaily((dailyRes.data || []).reverse());

      } catch (err) {
        console.error(err);
        alert("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey, API_URL]);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-bold">Analytics 📊</h1>

      {/* TOP ENDPOINTS */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10">
        <h2 className="mb-4">Top Endpoints</h2>

        {topEndpoints.length === 0 ? (
          <p className="text-gray-400">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topEndpoints}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="endpoint" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="count" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* DAILY */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10">
        <h2 className="mb-4">Daily Requests</h2>

        {daily.length === 0 ? (
          <p className="text-gray-400">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={daily}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="count" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}