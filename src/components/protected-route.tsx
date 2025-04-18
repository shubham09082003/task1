import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = UserAuth();

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
