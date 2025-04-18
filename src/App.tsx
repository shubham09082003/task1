import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/login"
import SignUpPage from "./pages/signup"
import { ThemeProvider } from "./components/theme-provider"
import ThemeToggle from "./components/theme-toggle"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="auth-ui-theme">
      <div className="min-h-screen bg-background">
        <Router>
          <ThemeToggle />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  )
}

export default App
