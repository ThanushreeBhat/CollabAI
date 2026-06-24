"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-65 bg-white border-r min-h-screen p-5">
      
      <h1 className="text-xl font-bold mb-8">AI Workspace</h1>

      <nav className="flex flex-col gap-3">

        <Link href="/AIEditor" className="p-2 rounded hover:bg-gray-100">
          AI Editor
        </Link>

        <Link href="/dailyplanner" className="p-2 rounded hover:bg-gray-100">
          Daily Planner
        </Link>

        <Link href="/checklist" className="p-2 rounded hover:bg-gray-100">
          Task Scheduler
        </Link>

      </nav>
    </div>
  );
}