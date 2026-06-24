"use client";

import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { Sparkles, FileText, Wand2, History, Trash2, CheckCircle, RefreshCcw } from "lucide-react";

export default function AIEditor() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAction = async (path) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/ai/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setText(data.result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, "notes"), {
        content: text,
        createdAt: new Date(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      loadNotes();
    } catch (error) {
      console.error(error);
    }
  };

  const loadNotes = async () => {
    try {
      const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setNotes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const deleteNote = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "notes", id));
      loadNotes();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      
      {/* Main editor pane */}
      <div className="flex-1 w-full space-y-6">
        <div className="glass-card rounded-[32px] overflow-hidden bg-white/80 border border-sky-100 flex flex-col shadow-lg shadow-sky-100/30">
          
          {/* Header toolbar */}
          <div className="p-6 border-b border-sky-100/50 flex justify-between items-center bg-sky-50/20">
            <div>
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Sparkles size={20} className="text-sky-500 animate-spin-slow" />
                AI Content Editor
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Draft content, summarize transcripts, or refine your writing voice.
              </p>
            </div>
            {text && (
              <button
                onClick={() => setText("")}
                className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
              >
                Clear text
              </button>
            )}
          </div>
          
          {/* Text editor body */}
          <textarea
            className="w-full min-h-[400px] p-8 text-slate-700 leading-relaxed text-base font-medium outline-none resize-none bg-transparent placeholder-slate-400"
            placeholder="Paste your paragraphs or jot down initial keywords here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          {/* Action trigger footer bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-5 bg-sky-50/40 border-t border-sky-100/50">
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleAction("summarize")}
                disabled={loading || !text.trim()}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5 shadow-sm shadow-rose-100"
              >
                <FileText size={14} />
                Summarize
              </button>
              <button
                onClick={() => handleAction("improve")}
                disabled={loading || !text.trim()}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-100"
              >
                <Wand2 size={14} />
                Refine Clarify
              </button>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleAction("generate")}
                disabled={loading || !text.trim()}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-2 shadow-md shadow-sky-100"
              >
                {loading ? (
                  <>
                    <RefreshCcw size={14} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Gemini Generate
                  </>
                )}
              </button>
              <button
                onClick={saveNote}
                disabled={loading || !text.trim()}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5 shadow-md ${
                  saveSuccess
                    ? "bg-emerald-500 text-white shadow-emerald-100"
                    : "bg-slate-800 hover:bg-slate-900 text-white"
                }`}
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle size={14} />
                    Saved!
                  </>
                ) : (
                  "Save Note"
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Right side history bar */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="glass-card rounded-[32px] border border-sky-100 bg-white/80 shadow-lg shadow-sky-100/30 overflow-hidden flex flex-col h-[560px]">
          
          <div className="p-5 border-b border-sky-100/50 bg-sky-50/20 flex items-center gap-2 justify-center">
            <History size={16} className="text-sky-500" />
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Saved Drafts History
            </h2>
          </div>
          
          {/* List scroll panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                <History size={32} className="opacity-30 mb-2" />
                <p className="text-xs font-semibold italic text-center">No history drafts saved.</p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setText(note.content)}
                  className="group relative p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-sky-300 hover:bg-white hover:shadow-sm cursor-pointer transition duration-150"
                >
                  <p className="text-xs font-semibold text-slate-700 line-clamp-3 leading-relaxed pr-6">
                    {note.content}
                  </p>
                  <div className="mt-2.5 text-[9px] font-bold text-sky-600 uppercase tracking-wider">
                    {note.createdAt?.toDate().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }) || "Recently"}
                  </div>
                  
                  <button
                    onClick={(e) => deleteNote(e, note.id)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-rose-50 rounded-lg"
                    title="Delete Draft"
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