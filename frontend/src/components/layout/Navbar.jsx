import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Calendar, Plus, Home, Search, LogIn, LogOut, User, Bot } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import { motion } from 'framer-motion'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const isKIIT = sessionStorage.getItem('college') === 'KIIT'

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/events', label: 'Events', icon: Search },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/assistant', label: 'AI Assistant', icon: Bot },
  ]

  if (isAuthenticated) {
    navItems.push({ path: '/create', label: 'Create Event', icon: Plus })
    
    // Only show Admin link for privileged users
    if (user && ['faculty', 'ksac_member', 'society_president', 'admin'].includes(user.role)) {
      navItems.push({ path: '/admin', label: 'Admin', icon: Bot })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass sticky top-0 z-50 border-b border-white/30 shadow-lg backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <div className={`w-10 h-10 bg-gradient-to-br ${
              isKIIT 
                ? 'from-green-500 via-emerald-500 to-green-600' 
                : 'from-blue-500 via-purple-500 to-pink-500'
            } rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform inline-block">
              Events Navigator{isKIIT ? (
                <span className="ml-2 text-green-600 font-extrabold">KIIT</span>
              ) : ''}
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}

            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors cursor-pointer rounded-lg hover:bg-blue-50">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user?.name || user?.email}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <select
              value={location.pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar

