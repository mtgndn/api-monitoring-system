"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Menu
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    {
      path: "/",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: <BarChart3 size={20} />
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <Settings size={20} />
    }
  ];

  return (
    <div
      className={`h-screen bg-white/5 backdrop-blur-lg border-r border-gray-800 p-4 transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* TOP */}
      <div className="flex items-center justify-between mb-10">
        {!collapsed && <h1 className="text-xl font-bold">🚀 Monitor</h1>}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/10 rounded-lg"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* MENU */}
      <div className="space-y-3">
        {menu.map((item) => (
          <Link key={item.path} href={item.path}>
            <div
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
              ${
                pathname === item.path
                  ? "bg-white text-black font-semibold"
                  : "hover:bg-white/10"
              }`}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}