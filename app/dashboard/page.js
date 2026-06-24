"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "../../lib/auth";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Brain,
  LogOut,
  Plus,
  ArrowRight,
  FilePlus2,
  ChevronRight,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [pages, setPages] = useState([]);

  // 🔐 Logout
  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  // Fetch pages in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pages"), (snapshot) => {
      const pageList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPages(pageList);
    });
    return () => unsubscribe();
  }, []);

  // Create new page (for sidebar + Open Workspace)
  const handleCreateWorkspace = async () => {
    const newId = crypto.randomUUID();
    await setDoc(doc(db, "pages", newId), {
      title: "Untitled Page",
      content: "",
      createdAt: new Date(),
    });
    router.push(`/page/${newId}`);
  };

  return (
    <div className="min-h-screen flex bg-slate-50/20">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-68 glass-panel min-h-screen flex flex-col p-6 shadow-lg shadow-sky-100/30 shrink-0 border-r border-sky-100/50">
        <h2 className="text-xl font-black mb-8 flex items-center gap-3 bg-gradient-to-r from-sky-600 to-indigo-700 bg-clip-text text-transparent">
          <div className="bg-gradient-to-tr from-sky-500 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-sky-200">
            <LayoutDashboard size={18} />
          </div>
          CollabAI
        </h2>

        {/* Workspace Section */}
        <div className="flex flex-col flex-1 min-h-0 mb-6">
          <div className="flex justify-between items-center px-3 mb-4">
            <span className="flex items-center gap-2 text-xs font-bold text-sky-600/70 uppercase tracking-widest">
              <FileText size={14} className="text-slate-400" />
              Real-Time Workspace
            </span>

            <button
              onClick={handleCreateWorkspace}
              className="p-1 rounded-lg text-sky-600 hover:bg-sky-100/70 hover:text-sky-800 transition active:scale-95"
              title="Create Document"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Page List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {pages.length === 0 ? (
              <p className="text-xs text-slate-400 italic px-3 py-2">No pages yet</p>
            ) : (
              pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => router.push(`/page/${page.id}`)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left truncate text-slate-600 hover:bg-sky-50/40 hover:text-sky-600 transition"
                >
                  <FileText size={14} className="text-slate-400" />
                  <span className="truncate">{page.title || page.id}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 rounded-xl transition-all border-t border-sky-100/70 pt-4"
        >
          <LogOut size={18} className="text-rose-400" />
          Logout
        </button>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-2 mb-10">
          Welcome to Your Collab<span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">Space</span>
        </h1>

        {/* 2 Cards Per Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Open Workspace */}
          <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col justify-between hover:scale-[1.01] transition-all bg-white/80 group">
            <div>
              <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-sky-100">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors mb-2">
                Real-Time Workspace
              </h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                Collaborate live with your team in shared documents.
              </p>
            </div>
            <button
              onClick={handleCreateWorkspace}
              className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 group/btn self-start shadow-md shadow-sky-100 transition-all active:scale-[0.98]"
            >
              <FilePlus2 size={16} />
              Open Workspace
              <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* AI Generate */}
          <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col justify-between hover:scale-[1.01] transition-all bg-white/80 group">
            <div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-indigo-100">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                AI Generate & Summarize
              </h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                Generate intelligent content instantly using Gemini AI.
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 group/btn self-start shadow-md shadow-indigo-100 transition-all active:scale-[0.98]"
            >
              <Sparkles size={16} />
              Generate Content
              <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Checklist */}
          <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col justify-between hover:scale-[1.01] transition-all bg-white/80 group">
            <div>
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-rose-100">
                <Brain size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-rose-600 transition-colors mb-2">
                Your Checklist
              </h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                Get a checklist for your tasks
              </p>
            </div>
            <button
              onClick={() => router.push("/checklist")}
              className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 group/btn self-start shadow-md shadow-rose-100 transition-all active:scale-[0.98]"
            >
              <Brain size={16} />
              Create Checklist
              <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Daily Planner */}
          <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col justify-between hover:scale-[1.01] transition-all bg-white/80 group">
            <div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-blue-100">
                <Brain size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">
                Daily Planner
              </h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                Plan and organize your daily tasks.
              </p>
            </div>
            <button
              onClick={() => router.push("/dailyplanner")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 group/btn self-start shadow-md shadow-blue-100 transition-all active:scale-[0.98]"
            >
              <Brain size={16} />
              Open Planner
              <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}
