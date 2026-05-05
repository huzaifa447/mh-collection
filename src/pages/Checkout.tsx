import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Lock, CreditCard } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

interface FormData {
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string
}

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'shipped' | 'delivered'
  createdAt: string
  shippingInfo: FormData
}

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || ''
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)
    try {
// Create order object with customer info at root level (matching AdminPanel expectation)
      const newOrder: Order = {
        _id: Date.now().toString(),
        items: items.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
        // Store customer info at root level (not nested) for AdminPanel compatibility
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        // Store user ID and email for tracking which customer placed the order
        userId: user?._id || user?.id || '',
        userEmail: user?.email || ''
      }

// Get existing orders from localStorage (use 'mh_orders' for AdminPanel compatibility)
      const existingOrders = JSON.parse(localStorage.getItem('mh_orders') || '[]')
      
      // Add new order
      const updatedOrders = [newOrder, ...existingOrders]
      localStorage.setItem('mh_orders', JSON.stringify(updatedOrders))
      
      // Also save to 'orders' key so UserProfile can display them with status updates
      const userOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const updatedUserOrders = [newOrder, ...userOrders]
      localStorage.setItem('orders', JSON.stringify(updatedUserOrders))
      
      clearCart()
      toast.success('Order placed successfully!')
      navigate('/profile')
    } catch (error) {
      toast.error('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-16 h-16 text-accent-silver/20 mx-auto mb-6" />
          <h2 className="font-heading text-2xl text-accent-white mb-4">Your Cart is Empty</h2>
          <Link to="/shop" className="luxury-btn">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="font-heading text-4xl text-accent-white mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 bg-primary-light border border-white/5">
                  <h3 className="font-heading text-xl text-accent-white mb-6">Shipping Information</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block font-body text-sm text-accent-silver mb-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="luxury-input"
                        placeholder="John Doe"
                      />
                      {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block font-body text-sm text-accent-silver mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="luxury-input"
                        placeholder="03001234567"
                      />
                      {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block font-body text-sm text-accent-silver mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="luxury-input"
                        placeholder="123 Main Street"
                      />
                      {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-body text-sm text-accent-silver mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="luxury-input"
                          placeholder="Lahore"
                        />
                        {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block font-body text-sm text-accent-silver mb-2">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="luxury-input"
                          placeholder="54000"
                        />
                        {errors.postalCode && <p className="text-red-400 text-sm mt-1">{errors.postalCode}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Security */}
                <div className="p-4 bg-primary-light border border-white/5 flex items-center gap-4">
                  <Lock className="w-5 h-5 text-accent-silver" />
                  <div>
                    <p className="font-body text-sm text-accent-white">Secure Checkout</p>
                    <p className="font-body text-xs text-accent-silver/60">Your payment information is encrypted</p>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 bg-primary-light border border-white/5">
                <h3 className="font-heading text-xl text-accent-white mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {items.map(item => (
                    <div key={item._id} className="flex justify-between items-center">
                      <div>
                        <p className="font-body text-sm text-accent-white">{item.name}</p>
                        <p className="font-body text-xs text-accent-silver/60">Qty: {item.quantity}</p>
                      </div>
PKR {(item.price * item.quantity).toLocaleString('en-PK')}
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="font-body text-accent-silver/60">Subtotal</span>
<span className="font-body text-accent-white">PKR {totalPrice.toLocaleString('en-PK')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body text-accent-silver/60">Shipping</span>
                    <span className="font-body text-accent-silver">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body text-accent-silver/60">Tax</span>
                    <span className="font-body text-accent-silver">Included</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex justify-between mb-6">
                    <span className="font-heading text-lg text-accent-white">Total</span>
<span className="price-tag text-xl">PKR {totalPrice.toLocaleString('en-PK')}</span>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="luxury-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Place Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Checkout
