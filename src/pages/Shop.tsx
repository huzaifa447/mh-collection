import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, Grid, List, Clock, ChevronDown } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
  category: string
  description: string
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [category, setCategory] = useState('all')
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [sortBy, category])

const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (sortBy) params.append('sort', sortBy)
      if (category !== 'all') params.append('category', category)
      const response = await axios.get(`/api/products?${params}`)
      setProducts(response.data)
    } catch {
      // Try localStorage first (products added by admin)
      const storedProducts = JSON.parse(localStorage.getItem('mh_products') || '[]')
      if (storedProducts.length > 0) {
        let filtered = storedProducts
        if (category !== 'all') {
          filtered = storedProducts.filter((p: Product) => p.category?.toLowerCase() === category.toLowerCase())
        }
        // Sort locally
        if (sortBy === 'price-low') filtered.sort((a: Product, b: Product) => a.price - b.price)
        else if (sortBy === 'price-high') filtered.sort((a: Product, b: Product) => b.price - a.price)
        setProducts(filtered)
      } else {
        // Demo data if no API/local
        const demoProducts = [
          {
            _id: 'demo1',
            name: 'Daytona Chronograph',
            price: 850000,
            images: ['slideimages/Blue and White Bold Watch Sale Facebook Shops Ad_20250904_215346_0000.png'],
            category: 'male'
          },
          {
            _id: 'demo2',
            name: 'Ladies Pearl Datejust',
            price: 650000,
            images: ['slideimages/Blue and White Bold Watch Sale Facebook Shops Ad_20250905_193113_0000.png'],
            category: 'female'
          },
          {
            _id: 'demo3',
            name: 'Couples Collection',
            price: 1200000,
            images: ['slideimages/Blue and White Bold Watch Sale Facebook Shops Ad_20250905_193243_0000.png'],
            category: 'couples'
          },
          {
            _id: 'demo4',
            name: 'Explorer II Adventure',
            price: 720000,
            images: ['slideimages/Blue and White Bold Watch Sale Facebook Shops Ad_20250909_145129_0000.png'],
            category: 'male'
          },
          {
            _id: 'demo5',
            name: 'Submariner Diver',
            price: 950000,
            images: ['slideimages/Blue and White Bold Watch Sale Facebook Shops Ad_20250904_215346_0000.png'],
            category: 'male'
          }
        ];
        let filtered = demoProducts;
        if (category !== 'all') {
          filtered = demoProducts.filter((p) => p.category?.toLowerCase() === category.toLowerCase())
        }
        // Sort
        if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price)
        else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price)
        setProducts(filtered);
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      quantity: 1
    })
    toast.success('Added to cart')
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <span className="inline-block font-body text-xs tracking-[0.3em] text-accent-silver mb-4">
            COLLECTION
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-accent-white mb-4">
            Our Timepieces
          </h1>
          <p className="font-body text-accent-silver/60 max-w-xl">
            Discover our curated collection of exceptional timepieces, each representing the pinnacle of Swiss watchmaking.
          </p>
        </motion.div>

        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-accent-silver hover:text-accent-white transition-colors">
              <Filter className="w-4 h-4" />
              <span className="font-body text-sm">Filters</span>
            </button>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="luxury-input py-2 px-4 w-auto"
            >
              <option value="all">All Categories</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="couples">Couples</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="luxury-input py-2 px-4 w-auto"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
            <div className="flex items-center gap-2 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-accent-white text-primary' : 'text-accent-silver'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-accent-white text-primary' : 'text-accent-silver'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="luxury-card">
                <div className="aspect-[4/5] skeleton"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 skeleton w-3/4"></div>
                  <div className="h-4 skeleton w-1/2"></div>
                  <div className="h-8 skeleton w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="luxury-card group cursor-pointer"
              >
<Link to={`/product/${product._id}`}>
                  <div className="aspect-[4/5] bg-primary-light flex items-center justify-center overflow-hidden img-zoom-container">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover img-zoom"
                        onError={(e) => { 
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = '<div className="w-40 h-40 rounded-full border border-accent-silver/20 flex items-center justify-center group-hover:border-accent-silver/40 transition-all duration-500"><svg className="w-16 h-16 text-accent-silver/40 group-hover:text-accent-silver transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>'
                        }}
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full border border-accent-silver/20 flex items-center justify-center group-hover:border-accent-silver/40 transition-all duration-500">
                        <Clock className="w-16 h-16 text-accent-silver/40 group-hover:text-accent-silver transition-colors duration-500" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-6">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-heading text-xl text-accent-white mb-2 group-hover:text-accent-silver transition-colors duration-300">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="font-body text-sm text-accent-silver/60 mb-4">
                    {product.category}
                  </p>
                  <div className="flex items-center justify-between">
PKR {product.price.toLocaleString('en-PK')}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="luxury-btn py-2 px-4 text-xs"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <button className="luxury-btn">
              Load More
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Shop
