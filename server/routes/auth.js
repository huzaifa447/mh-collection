const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'mhcollection_secret_key_2024'

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = new User({ name, email, password })
    await user.save()

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' })
    
    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    })
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' })
    
    res.json({
      token,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        isAdmin: user.isAdmin 
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed' })
  }
})

// Profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const updates = req.body

    const user = await User.findByIdAndUpdate(decoded.userId, updates, { new: true })
    
    res.json({
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        isAdmin: user.isAdmin 
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed' })
  }
})

// Initialize admin account
router.post('/init-admin', async (req, res) => {
  try {
    const adminEmail = 'huzaifaarif797@gmail.com'
    
    const existingAdmin = await User.findOne({ email: adminEmail })
    if (existingAdmin) {
      return res.json({ message: 'Admin already exists' })
    }

    const admin = new User({
      name: 'Admin',
      email: adminEmail,
      password: 'Huzaifa_2009',
      isAdmin: true
    })
    await admin.save()

    res.json({ message: 'Admin account created' })
  } catch (error) {
    res.status(500).json({ message: 'Admin initialization failed' })
  }
})

module.exports = router
