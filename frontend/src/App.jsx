import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";
import Scoreboard from "./pages/Scoreboard.jsx";
import Insights from "./pages/Insights.jsx";
import { getUser } from "./api/auth.js";

function Protected({ children }) {
  const u = getUser();
  return u ? children : <Navigate to="/" replace />;
}

function AdminOnly({ children }) {
  const u = getUser();
  if (!u) return <Navigate to="/" replace />;
  return u.role === "admin" ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminOnly>
            <Admin />
          </AdminOnly>
        }
      />
      <Route
        path="/scoreboard"
        element={
          <Protected>
            <Scoreboard />
          </Protected>
        }
      />
      <Route
        path="/insights"
        element={
          <Protected>
            <Insights />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
