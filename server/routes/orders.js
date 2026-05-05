const express = require('express')
const jwt = require('jsonwebtoken')
const Order = require('../models/Order')

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'mhcollection_secret_key_2024'

// Middleware to check auth
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort('-createdAt')
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
})

// Create order
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, fullName, phone, address, city, postalCode } = req.body
    
    // Check if user is authenticated
    let userId = null
    const token = req.headers.authorization?.split(' ')[1]
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        userId = decoded.userId
      } catch (err) {
        // Token invalid, continue as guest order
      }
    }
    
    const order = new Order({
      user: userId,
      items,
      totalAmount,
      fullName,
      phone,
      address,
      city,
      postalCode
    })
    
    await order.save()
    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' })
  }
})

module.exports = router
