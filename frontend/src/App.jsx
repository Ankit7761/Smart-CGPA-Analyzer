import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage          from "./pages/LoginPage";
import RegisterPage       from "./pages/RegisterPage";
import DashboardPage      from "./pages/DashboardPage";
import CalculatorPage     from "./pages/CalculatorPage";
import SemestersPage      from "./pages/SemestersPage";
import AnalyticsPage      from "./pages/AnalyticsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#16162a",
              color: "#f0f0ff",
              border: "1px solid rgba(124,106,255,0.25)",
              borderRadius: "12px",
              fontSize: "13px",
              fontFamily: "Outfit, sans-serif",
            },
            success: { iconTheme: { primary: "#06d6a0", secondary: "#16162a" } },
            error:   { iconTheme: { primary: "#ff6b6b", secondary: "#16162a" } },
          }}
        />
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Calculator is public */}
          <Route path="/calculator" element={<CalculatorPage />} />

          <Route path="/"              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/semesters"     element={<ProtectedRoute><SemestersPage /></ProtectedRoute>} />
          <Route path="/analytics"     element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
