import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, Mail, Phone } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="MH Collection" className="h-14 w-auto shadow-md rounded-lg" />
              <div>
                <h3 className="font-heading text-xl font-semibold text-gray-900 tracking-tight">MH Collection</h3>
                <p className="font-body text-xs text-gray-500 uppercase tracking-wide mt-1">Luxury Timepieces</p>
              </div>
            </Link>
            <p className="font-body text-sm text-gray-600 leading-relaxed max-w-xs">
              Timeless elegance. Unmatched craftsmanship. 
              The choice of discerning collectors.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Twitter, Facebook].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md hover:shadow-luxury transition-all duration-300 hover:-translate-y-0.5 border border-gray-100"
                  aria-label="Social"
                >
                  <Icon className="w-5 h-5 text-gray-700" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-gray-900 mb-6 tracking-tight">Explore</h4>
            <ul className="space-y-3">
              {['Home', 'Shop', 'New Arrivals', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="font-body text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 group flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-3 group-hover:bg-gray-900 transition-colors"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-gray-900 mb-6 tracking-tight">Service</h4>
            <ul className="space-y-3">
              {['Track Order', 'Returns', 'Warranty', 'Support'].map((item) => (
                <li key={item}>
                  <Link
                    to="/profile"
                    className="font-body text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 group flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-3 group-hover:bg-gray-900 transition-colors"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-gray-900 mb-6 tracking-tight">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="font-body text-sm text-gray-700 font-medium">+92 300 5963909</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="font-body text-sm text-gray-700 font-medium">info@mhcollection.com</span>
              </li>
            </ul>
            <p className="font-body text-xs text-gray-500 mt-4">
              Mon - Sat: 10AM - 8PM
              <br />
              Sun: 12PM - 6PM
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
            <p className="font-body text-gray-500">
              © {new Date().getFullYear()} MH Collection. All rights reserved. 
              <span className="hidden md:inline mx-2">•</span>
              <span className="text-xs">Crafted with precision</span>
            </p>
            <div className="flex items-center space-x-8">
              <Link to="/privacy" className="font-body text-gray-500 hover:text-gray-900 transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link to="/terms" className="font-body text-gray-500 hover:text-gray-900 transition-colors font-medium">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
