import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", targetCGPA: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name || !form.email || !form.password) { toast.error("Fill in all required fields"); return false; }
    if (form.password.length < 6) { toast.error("Password: min 6 characters"); return false; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords don't match"); return false; }
    if (form.targetCGPA && (form.targetCGPA < 0 || form.targetCGPA > 10)) { toast.error("CGPA: 0–10"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 fade-up">
          <div className="inline-flex w-16 h-16 rounded-2xl btn-primary items-center justify-center mb-4 pulse-glow">
            <span className="text-white font-bold text-xl font-mono">GX</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Start tracking your academic journey</p>
        </div>

        <div className="glass rounded-2xl p-8 fade-up fade-up-1" style={{ border: "1px solid rgba(124,106,255,0.15)" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Full Name", name: "name", type: "text", placeholder: "Ankit Sharma", required: true },
              { label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true },
              { label: "Password", name: "password", type: "password", placeholder: "Min. 6 characters", required: true },
              { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "••••••••", required: true },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  {field.label} {field.required && <span style={{ color: "#ff6b6b" }}>*</span>}
                </label>
                <input type={field.type} name={field.name} value={form[field.name]}
                  onChange={handleChange} placeholder={field.placeholder}
                  className="dark-input w-full px-4 py-3 rounded-xl text-sm font-medium" />
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Target CGPA <span style={{ color: "#5a5a7a" }}>(optional)</span>
              </label>
              <input type="number" name="targetCGPA" value={form.targetCGPA} onChange={handleChange}
                placeholder="e.g. 8.5" min="0" max="10" step="0.1"
                className="dark-input w-full px-4 py-3 rounded-xl text-sm font-medium font-mono-num" />
              <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>Powers the Goal Predictor on your dashboard</p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-50 mt-2">
              {loading ? "Creating..." : "Create Account →"}
            </button>
          </form>

          <div className="mt-6 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
