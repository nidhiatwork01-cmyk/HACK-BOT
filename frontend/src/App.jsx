import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { EventProvider } from './context/EventContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Events from './pages/Events'
import CreateEvent from './pages/CreateEvent'
import EventDetail from './pages/EventDetail'
import Calendar from './pages/Calendar'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivilegedRegister from './pages/PrivilegedRegister'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'
import Assistant from './pages/Assistant'

function AppContent() {
  const location = useLocation()
  const showNavbar = location.pathname !== '/'

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar />}
      <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privileged-register" element={<PrivilegedRegister />} />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <AppContent />
        </Router>
      </EventProvider>
    </AuthProvider>
  )
}

export default App

