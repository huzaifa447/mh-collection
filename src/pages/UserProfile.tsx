import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Package, MapPin, LogOut, Clock, CheckCircle, Truck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

interface Order {
  _id: string
  items: { name: string; quantity: number; price: number }[]
  totalAmount: number
  status: 'pending' | 'shipped' | 'delivered'
  createdAt: string
}

const UserProfile = () => {
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })

useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    // Sync profileData with current user
    setProfileData({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      postalCode: user.postalCode || ''
    })
  }, [user])

  // Refresh orders whenever the orders tab is shown
  useEffect(() => {
    if (activeTab === 'orders') {
      const storedOrders = localStorage.getItem('orders')
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders)
        // Filter orders for current user
        const userOrders = parsedOrders.filter((o: Order) => o.userEmail === user?.email || o.user?._id === user?._id)
        setOrders(userOrders)
      }
      setLoading(false)
    }
  }, [activeTab, user])

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(profileData)
      toast.success('Profile updated successfully')
      setEditingProfile(false)
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Logged out successfully')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-400" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400/10 text-yellow-400'
      case 'shipped':
        return 'bg-blue-400/10 text-blue-400'
      case 'delivered':
        return 'bg-green-400/10 text-green-400'
      default:
        return 'bg-gray-400/10 text-gray-400'
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="font-heading text-4xl text-accent-white mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="p-6 bg-primary-light border border-white/5">
                {/* User Info */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                  <div className="w-16 h-16 rounded-full bg-accent-white/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-accent-silver" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-accent-white">{user.name}</h3>
                    <p className="font-body text-sm text-accent-silver/60">{user.email}</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 p-3 transition-colors ${
                      activeTab === 'orders' ? 'bg-accent-white/10 text-accent-white' : 'text-accent-silver hover:text-accent-white'
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    <span className="font-body">My Orders</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 p-3 transition-colors ${
                      activeTab === 'profile' ? 'bg-accent-white/10 text-accent-white' : 'text-accent-silver hover:text-accent-white'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-body">Profile</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('address')}
                    className={`w-full flex items-center gap-3 p-3 transition-colors ${
                      activeTab === 'address' ? 'bg-accent-white/10 text-accent-white' : 'text-accent-silver hover:text-accent-white'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    <span className="font-body">Address Book</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-body">Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="font-heading text-2xl text-accent-white mb-6">My Orders</h2>
                  
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="p-6 bg-primary-light border border-white/5 skeleton"></div>
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-accent-silver/20 mx-auto mb-4" />
                      <p className="font-body text-accent-silver/60 mb-6">No orders yet</p>
                      <Link to="/shop" className="luxury-btn inline-block">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order._id} className="p-6 bg-primary-light border border-white/5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-body text-sm text-accent-silver/60">Order #{order._id}</p>
                              <p className="font-body text-xs text-accent-silver/40">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="font-body text-sm capitalize">{order.status}</span>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span className="font-body text-accent-white">{item.name} x {item.quantity}</span>
                                <span className="font-body text-accent-silver">PKR {item.price.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                            <span className="font-heading text-lg text-accent-white">Total</span>
                            <span className="price-tag">PKR {order.totalAmount.toLocaleString()}</span>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="flex justify-between mb-2">
                              <span className="font-body text-xs text-accent-silver/60">Order Placed</span>
                              <span className="font-body text-xs text-accent-silver/60">Shipped</span>
                              <span className="font-body text-xs text-accent-silver/60">Delivered</span>
                            </div>
                            <div className="h-1 bg-primary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-accent-silver transition-all duration-500"
                                style={{
                                  width: order.status === 'pending' ? '33%' : order.status === 'shipped' ? '66%' : '100%'
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="p-6 bg-primary-light border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-heading text-2xl text-accent-white">Profile Information</h2>
                      <button
                        onClick={() => editingProfile ? handleUpdateProfile() : setEditingProfile(true)}
                        className="luxury-btn py-2 px-4 text-sm"
                      >
                        {editingProfile ? 'Save Changes' : 'Edit'}
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block font-body text-sm text-accent-silver mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editingProfile ? profileData.name : user.name}
                          onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!editingProfile}
                          className="luxury-input"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-sm text-accent-silver mb-2">Email</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="luxury-input opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-sm text-accent-silver mb-2">Phone</label>
                        <input
                          type="tel"
                          value={editingProfile ? profileData.phone : (user.phone || '')}
                          onChange={e => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!editingProfile}
                          className="luxury-input"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'address' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="p-6 bg-primary-light border border-white/5">
                    <h2 className="font-heading text-2xl text-accent-white mb-6">Saved Addresses</h2>
                    
                    <div className="space-y-4">
                      <div className="p-4 border border-white/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-body text-accent-white">{user.name}</p>
                            <p className="font-body text-sm text-accent-silver/60 mt-1">
                              {user.address || 'No address added'}<br />
                              {user.city && `${user.city}, ${user.postalCode}`}
                            </p>
                          </div>
                          <button 
                            onClick={() => setActiveTab('profile')}
                            className="font-body text-sm text-accent-silver hover:text-accent-white"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UserProfile
