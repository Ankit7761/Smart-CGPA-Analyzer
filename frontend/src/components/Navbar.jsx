import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const NAV_LINKS = [
  { path: "/",           label: "Dashboard",  icon: "⬡" },
  { path: "/calculator", label: "Calculator", icon: "◈" },
  { path: "/semesters",  label: "Semesters",  icon: "◫" },
  { path: "/analytics",  label: "Analytics",  icon: "◬" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50" style={{ background: "rgba(10,10,20,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center pulse-glow">
            <span className="text-white font-bold text-sm font-mono">GX</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-white text-sm tracking-wide">CGPA</span>
            <span className="font-light text-primary-400 text-sm"> Analyzer</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "text-primary-400 bg-primary-500/10 border border-primary-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base leading-none">{link.icon}</span>
                <span className="hidden sm:block">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-6 h-6 rounded-full bg-primary-500/30 flex items-center justify-center">
              <span className="text-primary-400 text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <span className="text-gray-300 text-xs font-medium">{user?.name?.split(" ")[0]}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-accent-red transition-colors font-medium px-2 py-1"
          >
            Exit
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
