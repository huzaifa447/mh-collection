import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200 transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 p-1.5 lg:p-2 rounded-lg hover:bg-gray-50 transition-colors group">
            <img src="/logo.png" alt="MH Collection" className="h-9 w-auto lg:h-11 shadow-md rounded" />
            <div className="hidden lg:block">
              <span className="font-heading text-lg font-bold text-gray-900 tracking-tight block leading-tight">MH Collection</span>
              <span className="font-body text-xs text-gray-500 uppercase tracking-wider">Luxury Watches</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-body text-sm lg:text-base tracking-wide font-medium py-2 px-3 rounded-lg transition-all duration-200 relative group ${
                  location.pathname === link.path
                    ? 'text-gray-900 bg-gray-100 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{ '--i': index } as React.CSSProperties}
              >
                {link.name}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-gray-900 rounded-full group-hover:w-4/5 transition-all duration-300 origin-left"></span>
              </Link>
            ))}
          </div>

          {/* Icons & Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">


            {/* Cart */}
            <Link to="/cart" className="relative p-2 lg:p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group">
              <ShoppingBag className="w-5 h-5 lg:w-5 lg:h-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {/* User */}
            <div className="ml-2 lg:ml-4">
              {user ? (
                <Link
                  to="/profile"
                  className="p-2 lg:p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center space-x-1.5"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline font-medium text-sm">Account</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="luxury-btn text-xs px-4 py-1.5 font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-xl"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-body text-base text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Link to="/login" className="block luxury-btn w-full text-sm font-medium text-center py-3 mb-3">
                  Sign In
                </Link>
                <Link to="/cart" className="flex items-center justify-center text-gray-700 hover:text-gray-900 font-medium">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Cart ({totalItems})
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
