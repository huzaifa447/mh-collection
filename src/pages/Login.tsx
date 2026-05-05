import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const slides = [
    '/slideimages/Blue and White Bold Watch Sale Facebook Shops Ad_20250904_215346_0000.png',
    '/slideimages/Blue and White Bold Watch Sale Facebook Shops Ad_20250905_193113_0000.png',
    '/slideimages/Blue and White Bold Watch Sale Facebook Shops Ad_20250905_193243_0000.png',
    '/slideimages/Blue and White Bold Watch Sale Facebook Shops Ad_20250909_145129_0000.png'
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }
    if (!isLogin && !formData.name) {
      toast.error('Please enter your name')
      return
    }

    setLoading(true)
    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        toast.success('Welcome back!')
        if (formData.email.toLowerCase() === 'huzaifaarif797@gmail.com') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        await register(formData.name, formData.email, formData.password)
        toast.success('Account created successfully!')
        navigate('/')
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.1] [background-size:100px_100px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/50" />
      
      {/* Floating Luxury Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-gold-400 to-amber-500 rounded-full blur-xl animate-pulse opacity-20" />
      <div className="absolute bottom-32 right-20 w-32 h-32 bg-gradient-to-br from-slate-200 to-blue-200 rounded-full blur-2xl animate-pulse opacity-30 delay-1000" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Luxury Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white/80 backdrop-blur-xl shadow-3xl rounded-3xl border border-white/50 p-10"
          >
            {/* Logo */}
            <div className="text-center mb-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gold-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                <span className="font-serif text-3xl font-black text-white drop-shadow-lg">MH</span>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-5xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 font-black tracking-tight"
              >
                {isLogin ? 'Welcome Back' : 'Join Us'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 text-lg font-medium"
              >
                {isLogin ? 'Sign in to your account' : 'Create your luxury account'}
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg placeholder-gray-400"
                    placeholder="Full Name"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg placeholder-gray-400"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg placeholder-gray-400"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-wide"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isLogin ? 'Signing In...' : 'Creating...'}
                  </>
                ) : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="text-center mt-8 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-600 hover:text-gray-900 font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
              >
                {isLogin ? (
                  <>
                    Don't have an account? 
                    <span className="text-blue-600 font-bold">Sign Up</span>
                  </>
                ) : (
                  <>
                    Already have an account? 
                    <span className="text-blue-600 font-bold">Sign In</span>
                  </>
                )}
              </button>
            </div>


          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Login

