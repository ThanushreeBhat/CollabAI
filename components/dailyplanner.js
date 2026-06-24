"use client";

import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { Calendar, Sparkles, CheckCircle2, History, Trash2, Clock, Play, ListPlus } from "lucide-react";

export default function DailyPlanner() {
  const [tasks, setTasks] = useState("");
  const [plan, setPlan] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const generatePlan = async () => {
    if (!tasks.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: tasks }),
      });
      const data = await res.json();
      setPlan(data.result);
    } catch (error) {
      alert("Error generating plan");
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    if (!plan.trim()) return;
    try {
      await addDoc(collection(db, "plans"), {
        content: plan,
        createdAt: new Date(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      loadHistory();
    } catch (error) {
      console.error(error);
    }
  };

  const loadHistory = async () => {
    try {
      const q = query(collection(db, "plans"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setHistory(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    }
  };

  const deletePlan = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "plans", id));
      loadHistory();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      
      {/* Left Input and Generated Schedule */}
      <div className="flex-1 w-full space-y-6">
        <div className="glass-card rounded-[32px] overflow-hidden bg-white/80 border border-sky-100 flex flex-col shadow-lg shadow-sky-100/30">
          
          <div className="p-6 border-b border-sky-100/50 flex justify-between items-center bg-sky-50/20">
            <div>
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Calendar size={20} className="text-sky-500" />
                AI Daily Planner
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Feed in your list of tasks and let AI plan a structured hourly schedule.
              </p>
            </div>
            {tasks && (
              <button
                onClick={() => {
                  setTasks("");
                  setPlan("");
                }}
                className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
              >
                Clear text
              </button>
            )}
          </div>
          
          {/* Daily list inputs */}
          <textarea
            placeholder="Enter your tasks (e.g. 9am Gym, 11am Client Call, Lunch at 1pm, Finish project writeup)..."
            className="w-full h-48 p-8 text-slate-700 leading-relaxed text-base font-medium outline-none resize-none bg-transparent placeholder-slate-400"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
          />

          <div className="p-5 bg-sky-50/40 border-t border-sky-100/50 flex justify-end gap-3">
            <button
              onClick={generatePlan}
              disabled={loading || !tasks.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition active:scale-95 flex items-center gap-2 shadow-md shadow-sky-100"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Sparkles size={14} />
              )}
              {loading ? "Planning..." : "Generate Schedule"}
            </button>
            
            <button
              onClick={savePlan}
              disabled={!plan || saveSuccess}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5 shadow-md ${
                saveSuccess
                  ? "bg-emerald-500 text-white shadow-emerald-100"
                  : "bg-slate-800 hover:bg-slate-900 text-white disabled:opacity-40"
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 size={14} />
                  Saved!
                </>
              ) : (
                <>
                  <ListPlus size={14} />
                  Save Schedule
                </>
              )}
            </button>
          </div>
        </div>

        {/* Schedule Output box */}
        {plan && (
          <div className="glass-card rounded-[32px] p-6 md:p-8 bg-white/95 border-2 border-sky-200/60 shadow-xl shadow-sky-100/40 animate-fade-in">
            <div className="flex items-center gap-2 mb-4 border-b border-sky-100/50 pb-3">
              <Clock size={16} className="text-sky-500" />
              <h3 className="text-xs font-black text-sky-600 uppercase tracking-widest">
                Your Generated Hourly Schedule
              </h3>
            </div>
            
            <div className="text-slate-700 text-sm leading-relaxed font-semibold whitespace-pre-wrap pl-1">
              {plan}
            </div>
          </div>
        )}
      </div>

      {/* Right side history bar */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="glass-card rounded-[32px] border border-sky-100 bg-white/80 shadow-lg shadow-sky-100/30 overflow-hidden flex flex-col h-[560px]">
          
          <div className="p-5 border-b border-sky-100/50 bg-sky-50/20 flex items-center gap-2 justify-center">
            <History size={16} className="text-sky-500" />
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Saved Schedules
            </h2>
          </div>
          
          {/* History scroll list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                <History size={32} className="opacity-30 mb-2" />
                <p className="text-xs font-semibold italic text-center">No saved plans yet.</p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setPlan(item.content)}
                  className="group relative p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-sky-300 hover:bg-white hover:shadow-sm cursor-pointer transition duration-150"
                >
                  <p className="text-xs font-semibold text-slate-700 line-clamp-3 leading-relaxed pr-6">
                    {item.content}
                  </p>
                  
                  <div className="mt-2.5 text-[9px] font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1">
                    <Play size={8} />
                    {item.createdAt?.toDate().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    }) || "Recent"}
                  </div>
                  
                  <button
                    onClick={(e) => deletePlan(e, item.id)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-rose-50 rounded-lg"
                    title="Delete Saved Plan"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
          
        </div>
      </div>

    </div>
  );
}