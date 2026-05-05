const express = require('express')
const jwt = require('jsonwebtoken')
const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/User')

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'mhcollection_secret_key_2024'

// Middleware to check admin
const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const decoded = jwt.verify(token, JWT_SECRET)
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Get all orders (admin)
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone address city')
      .sort('-createdAt')
    
    // Format orders with user info or shipping info
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      user: order.user,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      // Use user info if available, otherwise use shipping info from order
      fullName: order.user?.name || order.fullName,
      phone: order.user?.phone || order.phone,
      address: order.user?.address || order.address,
      city: order.user?.city || order.city,
      postalCode: order.user?.postalCode || order.postalCode,
      userEmail: order.user?.email
    }))
    
    res.json(formattedOrders)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
})

// Update order status
router.put('/orders/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' })
  }
})

// Get all products (admin)
router.get('/products', adminAuth, async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' })
  }
})

// Get stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalProducts, totalOrders, pendingOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' })
    ])
    
    res.json({ totalProducts, totalOrders, pendingOrders })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats' })
  }
})

// Get all users (admin)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({}, '-password')
      .select('name email phone address city postalCode isAdmin createdAt')
      .sort('-createdAt')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

module.exports = router
