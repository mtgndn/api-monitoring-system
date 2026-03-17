"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [apiKey, setApiKey] = useState("");
  const [total, setTotal] = useState(0);
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

        const [totalRes, topRes, dailyRes] = await Promise.all([
          axios.get(`${API_URL}/analytics/total`, { headers }),
          axios.get(`${API_URL}/analytics/top-endpoints`, { headers }),
          axios.get(`${API_URL}/analytics/daily`, { headers })
        ]);

        setTotal(totalRes.data.total);
        setTopEndpoints(topRes.data);
        setDaily(dailyRes.data.reverse());

      } catch (err) {
        console.error(err);
        alert("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey, API_URL]);

  // ⏳ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-8">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-10">
        API Monitoring Dashboard 🚀
      </h1>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:scale-105 transition border border-white/10">
          <p className="text-gray-300 text-sm">Total Requests</p>
          <h2 className="text-3xl font-bold mt-2">{total}</h2>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:scale-105 transition border border-white/10">
          <p className="text-gray-300 text-sm">Active Users</p>
          <h2 className="text-3xl font-bold mt-2">1</h2>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:scale-105 transition border border-white/10">
          <p className="text-gray-300 text-sm">Success Rate</p>
          <h2 className="text-3xl font-bold mt-2">100%</h2>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-10 border border-white/10">
        <h2 className="text-xl mb-4">Daily Usage</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={daily}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#4ade80"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TOP ENDPOINTS */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10">
        <h2 className="text-xl mb-4">Top Endpoints</h2>

        {topEndpoints.map((item, i) => (
          <div
            key={i}
            className="flex justify-between py-3 border-b border-gray-700 hover:bg-white/5 px-2 rounded transition"
          >
            <span>{item.endpoint}</span>
            <span className="font-bold">{item.count}</span>
          </div>
        ))}
      </div>

    </div>
  );
}