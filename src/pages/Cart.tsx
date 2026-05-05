import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart()

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
          <p className="font-body text-accent-silver/60 mb-8">
            Discover our exceptional collection of timepieces.
          </p>
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
          <h1 className="font-heading text-4xl text-accent-white mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 p-6 bg-primary-light border border-white/5"
                >
                  <div className="w-32 h-32 bg-primary flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-8 h-8 text-accent-silver/20" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-heading text-lg text-accent-white mb-1">
                          {item.name}
                        </h3>
                        <p className="font-body text-sm text-accent-silver/60">
                          Premium Timepiece
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 text-accent-silver/40 hover:text-accent-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-4 border border-white/10">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-3 hover:text-accent-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-body w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-3 hover:text-accent-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
PKR {(item.price * item.quantity).toLocaleString('en-PK')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 bg-primary-light border border-white/5">
                <h3 className="font-heading text-xl text-accent-white mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-body text-accent-silver/60">Subtotal</span>
                    <span className="font-body text-accent-white">PKR {totalPrice.toLocaleString('en-PK')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body text-accent-silver/60">Shipping</span>
                    <span className="font-body text-accent-silver/40">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body text-accent-silver/60">Tax</span>
                    <span className="font-body text-accent-silver/40">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-heading text-lg text-accent-white">Total</span>
                    <span className="price-tag text-xl">PKR {totalPrice.toLocaleString('en-PK')}</span>
                  </div>
                </div>

                <Link to="/checkout" className="luxury-btn-primary w-full flex items-center justify-center gap-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link to="/shop" className="block text-center mt-4 font-body text-sm text-accent-silver/60 hover:text-accent-white transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Cart
