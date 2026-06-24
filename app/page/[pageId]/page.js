"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { auth } from "../../../lib/firebase";
import { ChevronLeft, Copy, Check, FileText, Globe, Loader2 } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const { pageId } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!pageId) return;

    const docRef = doc(db, "pages", pageId);

    const unsubscribe = onSnapshot(docRef, async (snapshot) => {
      if (!snapshot.exists()) {
        await setDoc(docRef, {
          title: "Untitled Page",
          content: "",
          updatedAt: new Date(),
          updatedBy: auth.currentUser?.email || "Unknown",
        });
      } else {
        const data = snapshot.data();
        setTitle(data.title || "Untitled Page");
        setContent(data.content || "");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [pageId]);

  // Copy Link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // Save Title
  const handleTitleChange = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    await setDoc(
      doc(db, "pages", pageId),
      { title: newTitle },
      { merge: true }
    );
  };

  // Save Content
  const handleContentChange = async (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    await setDoc(
      doc(db, "pages", pageId),
      {
        content: newContent,
        updatedAt: new Date(),
        updatedBy: auth.currentUser?.email || "Unknown",
      },
      { merge: true }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading document...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/20 p-6 md:p-8 flex items-center justify-center">
      <div className="glass-card w-full max-w-4xl p-6 md:p-8 rounded-[32px] bg-white/80 border border-sky-100 shadow-xl shadow-sky-100/30">

        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-sky-100/50">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-sky-50/80 hover:text-sky-700 border border-slate-200 rounded-xl transition duration-150 active:scale-95"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition duration-150 active:scale-95 shadow-md shadow-sky-100 ${
              copied
                ? "bg-emerald-500 text-white shadow-emerald-100"
                : "bg-sky-500 hover:bg-sky-600 text-white"
            }`}
          >
            {copied ? (
              <>
                <Check size={14} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy Link
              </>
            )}
          </button>
        </div>

        {/* Editable Title */}
        <div className="relative mb-5 flex items-center gap-3">
          <div className="p-2 bg-sky-50 text-sky-500 rounded-lg shrink-0">
            <FileText size={20} />
          </div>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="text-2xl md:text-3xl font-black w-full text-slate-800 outline-none border-b border-transparent focus:border-sky-200 focus:bg-sky-50/20 px-2 py-1 rounded-xl transition-all"
            placeholder="Document Title"
          />
        </div>

        {/* Content Area */}
        <div className="relative flex flex-col">
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full h-96 p-6 bg-slate-50/50 border border-slate-200 focus:border-sky-300 focus:bg-white rounded-2xl outline-none resize-none text-slate-700 leading-relaxed text-sm md:text-base font-medium shadow-inner transition-all"
            placeholder="Start typing..."
          />
          
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-sky-500/10 border border-sky-100 text-sky-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest pointer-events-none select-none">
            <Globe size={11} className="animate-spin-slow" />
            Live Sync Active
          </div>
        </div>

      </div>
    </div>
  );
}
