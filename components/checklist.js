"use client";

import { useState } from "react";
import { ListTodo, Plus, Calendar, AlertCircle, Trash2, CheckCircle2 } from "lucide-react";

export default function Checklist() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const addTask = () => {
    if (!taskText.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: taskText, done: false, priority, dueDate },
    ]);
    setTaskText("");
  };

  const getPriorityBadgeClass = (p) => {
    switch (p) {
      case "high":
        return "bg-rose-50 border-rose-100 text-rose-600";
      case "medium":
        return "bg-indigo-50 border-indigo-100 text-indigo-600";
      case "low":
        return "bg-sky-50 border-sky-100 text-sky-600";
      default:
        return "bg-slate-50 border-slate-100 text-slate-600";
    }
  };

  const activeCount = tasks.filter((t) => !t.done).length;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      
      {/* Main Checklist Card */}
      <div className="glass-card rounded-[32px] p-6 md:p-8 bg-white/80 border border-sky-100 shadow-lg shadow-sky-100/30">
        
        {/* Header Title */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-sky-100/50">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <ListTodo size={20} className="text-sky-500" />
              Task Scheduler
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Organize priorities, schedule deadlines, and monitor your progress.
            </p>
          </div>
          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-xl">
            {activeCount} Active {activeCount === 1 ? "Task" : "Tasks"}
          </span>
        </div>

        {/* Form Inputs Block */}
        <div className="flex flex-col md:flex-row gap-3 items-center mb-8 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl focus-within:bg-white focus-within:border-sky-200 focus-within:shadow-md focus-within:shadow-sky-100/30 transition-all duration-200">
          <input
            type="text"
            placeholder="Add a new task..."
            className="w-full md:flex-1 px-3 py-2.5 outline-none text-slate-700 bg-transparent placeholder-slate-400 text-sm font-semibold"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
          />
          
          <div className="flex gap-2 items-center w-full md:w-auto shrink-0 justify-between md:justify-start px-2 border-t md:border-t-0 md:border-l border-slate-200/60 pt-2.5 md:pt-0">
            <div className="flex gap-2 items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:inline">Priority:</span>
              <select
                className="text-xs font-bold uppercase bg-white text-slate-600 p-2.5 rounded-xl border border-slate-200 outline-none cursor-pointer hover:bg-slate-50 transition"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🔵 Low</option>
              </select>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:inline">Due:</span>
              <div className="relative">
                <input
                  type="date"
                  className="text-xs font-semibold bg-white text-slate-600 p-2.5 rounded-xl border border-slate-200 outline-none cursor-pointer hover:bg-slate-50 transition"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={addTask}
            className="w-full md:w-auto bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-sky-100 shrink-0"
          >
            <Plus size={14} />
            Add Task
          </button>
        </div>

        {/* Task Items Scrollable Area */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-sky-100 rounded-3xl flex flex-col items-center justify-center text-slate-400">
              <ListTodo size={36} className="opacity-20 mb-2" />
              <p className="text-xs font-semibold italic">Your checklist is empty. Add a task to begin.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-center justify-between p-4 rounded-2xl transition-all border ${
                  task.done
                    ? "bg-slate-50/50 border-transparent opacity-60"
                    : "bg-white border-slate-100 hover:border-sky-200 hover:shadow-sm shadow-sky-100/20"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Status checkbox button toggle */}
                  <button
                    onClick={() =>
                      setTasks(
                        tasks.map((t) =>
                          t.id === task.id ? { ...t, done: !t.done } : t
                        )
                      )
                    }
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all shrink-0 ${
                      task.done
                        ? "bg-sky-500 border-sky-500 text-white"
                        : "border-slate-300 hover:border-sky-500 hover:bg-sky-50/40"
                    }`}
                  >
                    {task.done && <CheckCircle2 size={14} />}
                  </button>

                  <div className="min-w-0">
                    <p
                      className={`text-sm md:text-base font-semibold leading-normal truncate transition-all ${
                        task.done ? "line-through text-slate-400" : "text-slate-800"
                      }`}
                    >
                      {task.text}
                    </p>
                    <div className="flex flex-wrap gap-2.5 mt-1 items-center">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-lg border font-black uppercase tracking-wider ${getPriorityBadgeClass(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                          <Calendar size={11} />
                          Due {new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))}
                  className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-rose-50 rounded-xl"
                  title="Remove Task"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>
        
      </div>
      
    </div>
  );
}