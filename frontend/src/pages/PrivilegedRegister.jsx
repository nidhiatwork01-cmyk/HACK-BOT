import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, UserPlus, Mail, Lock, User, Building2 } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { motion } from 'framer-motion'

const PrivilegedRegister = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'faculty',
    secret_key: '',
    society_name: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (!formData.secret_key) {
      setError('Secret key is required for privileged access')
      setLoading(false)
      return
    }

    if (formData.role === 'society_president' && !formData.society_name) {
      setError('Society name is required for society presidents')
      setLoading(false)
      return
    }

    try {
      await register(
        formData.email, 
        formData.password, 
        formData.name,
        formData.role,
        formData.secret_key,
        formData.society_name
      )
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const roleDescriptions = {
    faculty: 'Faculty members can view and respond to all event requests',
    ksac_member: 'KSAC members can manage event requests and coordinate events',
    society_president: 'Society presidents can view requests related to their society',
    admin: 'Full administrative access to all features'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">KSAC Special Access</h1>
            <p className="text-gray-600">Register as Faculty, KSAC Member, or Society President</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. John Doe"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                School Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.name@kiit.ac.in"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4" />
                Role
              </label>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="faculty">Faculty Member</option>
                <option value="ksac_member">KSAC Member</option>
                <option value="society_president">Society President</option>
                <option value="admin">Admin</option>
              </Select>
              <p className="mt-1 text-xs text-gray-500">
                {roleDescriptions[formData.role]}
              </p>
            </div>

            {formData.role === 'society_president' && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4" />
                  Society Name
                </label>
                <Input
                  type="text"
                  name="society_name"
                  value={formData.society_name}
                  onChange={handleChange}
                  placeholder="e.g., Coding Club"
                  required
                />
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4" />
                Secret Key
              </label>
              <Input
                type="password"
                name="secret_key"
                value={formData.secret_key}
                onChange={handleChange}
                placeholder="Enter your secret key"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Contact administration to obtain your secret key
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4" />
                Confirm Password
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Register as Privileged User'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Regular student?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
                Student Sign Up
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default PrivilegedRegister

