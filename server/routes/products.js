const express = require('express')
const Product = require('../models/Product')
const multer = require('multer')
const path = require('path')

const router = express.Router()

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files allowed'), false)
    }
  }
})

// Get all products
router.get('/', async (req, res) => {
  try {
    const { sort, category } = req.query
    let query = Product.find()
    
    if (category && category !== 'all') {
      query = query.where('category').equals(category)
    }

    if (sort === 'price-low') {
      query = query.sort('price')
    } else if (sort === 'price-high') {
      query = query.sort('-price')
    } else if (sort === 'name') {
      query = query.sort('name')
    } else {
      query = query.sort('-createdAt')
    }

    const products = await query
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' })
  }
})

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product' })
  }
})

// Create product - support multiple images upload or body images array
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
  let images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : []
    if (req.body.imageUrls) {
      try {
        const urlImages = JSON.parse(req.body.imageUrls)
        images = [...images, ...urlImages]
      } catch {}
    }
    if (!req.files && req.body.images) {
      try {
        images = JSON.parse(req.body.images)
      } catch {}
    }
    const productData = {
      ...req.body,
      price: Number(req.body.price),
      images
    }
    const product = new Product(productData)
    await product.save()
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create product' })
  }
})

// Update product - support multiple images upload or body images array
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

  let images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : []
    if (req.body.imageUrls) {
      try {
        const urlImages = JSON.parse(req.body.imageUrls)
        images = [...images, ...urlImages]
      } catch {}
    }
    if (!req.files && req.body.images) {
      try {
        images = JSON.parse(req.body.images)
      } catch {}
    }
    const updateData = {
      ...req.body,
      price: Number(req.body.price),
      images: images.length > 0 ? images : product.images
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update product' })
  }
})

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' })
  }
})

module.exports = router
