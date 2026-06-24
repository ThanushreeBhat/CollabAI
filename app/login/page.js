"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail, registerWithEmail } from "../../lib/auth";
import { Sparkles, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      // Clean up Firebase error messages to be user friendly
      let friendlyMsg = err.message;
      if (err.code === "auth/invalid-credential") {
        friendlyMsg = "Invalid email or password. Please try again.";
      } else if (err.code === "auth/email-already-in-use") {
        friendlyMsg = "This email is already registered.";
      } else if (err.code === "auth/weak-password") {
        friendlyMsg = "Password must be at least 6 characters long.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMsg = "Please enter a valid email address.";
      }
      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-slate-50 to-blue-100/60 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md glass-card p-8 md:p-10 rounded-[32px] shadow-xl shadow-sky-100/50 border border-sky-100">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-sky-500 to-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-sky-200 mb-4">
            <Sparkles size={28} className="animate-spin-slow" />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-sky-600 to-indigo-700 bg-clip-text text-transparent">
            CollabAI
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-1.5 uppercase tracking-widest">
            {isLogin ? "Welcome back to your workspace" : "Create your collaborative space"}
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-rose-50 border border-rose-100/70 text-rose-600 px-4 py-3 rounded-2xl text-xs font-semibold mb-6 flex items-start gap-2 shadow-sm animate-shake">
            <span className="font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white text-slate-800 text-sm font-semibold transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white text-slate-800 text-sm font-semibold transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-sky-200/50 flex items-center justify-center gap-2 group transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                {isLogin ? "Sign In" : "Get Started"}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between login/signup */}
        <p className="mt-8 text-center text-xs font-semibold text-slate-500">
          {isLogin ? "New to CollabAI?" : "Already have an account?"}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="ml-1.5 text-sky-600 hover:text-indigo-600 hover:underline font-bold transition-all"
          >
            {isLogin ? "Create Account" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
