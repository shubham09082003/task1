import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/login"
import SignUpPage from "./pages/signup"
import DashboardPage from "./pages/dashboard"
import ThemeToggle from "./components/theme-toggle"
import { AuthProvider } from "./context/auth-context"
import { ProtectedRoute } from "./components/protected-route"

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
        <Router>
          <ThemeToggle />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  )
}

export default App
