import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("Fill in all fields"); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 fade-up">
          <div className="inline-flex w-16 h-16 rounded-2xl btn-primary items-center justify-center mb-4 pulse-glow">
            <span className="text-white font-bold text-xl font-mono">GX</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Sign in to your CGPA Analyzer</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 fade-up fade-up-1" style={{ border: "1px solid rgba(124,106,255,0.15)" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className="dark-input w-full px-4 py-3.5 rounded-xl text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className="dark-input w-full px-4 py-3.5 rounded-xl text-sm font-medium" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-50 mt-2">
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="mt-6 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No account?{" "}
              <Link to="/register" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {/* Quick tip */}
        <div className="mt-4 text-center fade-up fade-up-2">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Try the <Link to="/calculator" className="text-primary-400 hover:underline">Calculator</Link> without signing in ↗
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
