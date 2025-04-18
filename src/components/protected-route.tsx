import { Navigate } from "react-router-dom"
import { UserAuth } from "../context/AuthContext"


export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = UserAuth();

  return <>{session ? <>{children}</> : <Navigate to={"/login"}/>}</>
} 