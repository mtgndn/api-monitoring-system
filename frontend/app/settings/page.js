"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const savedKey = localStorage.getItem("apiKey");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const copyKey = () => {
    if (!apiKey) return;

    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateKey = async () => {
    try {
      setLoading(true);

      let endpoint = "";
      let headers = {};

      if (!apiKey) {
        endpoint = `${API_URL}/user/create-key`;
      } else {
        endpoint = `${API_URL}/user/regenerate-key`;
        headers["x-api-key"] = apiKey;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const data = await res.json();

      if (!data.apiKey) {
        throw new Error("No API key returned");
      }

      setApiKey(data.apiKey);
      localStorage.setItem("apiKey", data.apiKey);

    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("apiKey");
    window.location.href = "/";
  };

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-bold">Settings ⚙️</h1>

      {/* API KEY */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10">

        <h2 className="text-lg mb-3">API Key</h2>

        <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg">
          <span className="text-sm break-all">
            {apiKey || "No API Key"}
          </span>

          <button
            onClick={copyKey}
            disabled={!apiKey}
            className="bg-blue-500 px-3 py-1 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <button
          onClick={regenerateKey}
          disabled={loading}
          className="mt-4 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : apiKey
            ? "Regenerate API Key"
            : "Create API Key"}
        </button>

      </div>

      {/* ACCOUNT */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10">
        <h2 className="text-lg mb-3">Account</h2>

        <p className="text-sm text-gray-300">
          Email: test@test.com
        </p>

        <button
          onClick={logout}
          className="mt-4 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Logout
        </button>
      </div>

    </div>
  );
}