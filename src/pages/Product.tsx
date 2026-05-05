import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ChevronLeft, ChevronRight, Plus, Minus, Heart, Share2, Check } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'

interface Product {
  _id: string
  id?: string
  name: string
  price: number
  image?: string
  images: string[]
  description: string
  category?: string
  specifications?: {
    movement: string
    caseSize: string
    waterResistance: string
    crystal: string
    bracelet: string
  }
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams({sort: 'newest'});
        const response = await axios.get(`/api/products?${params}`);
        setProducts(response.data);
      } catch {
        const storedProducts = JSON.parse(localStorage.getItem('mh_products') || '[]');
        setProducts(storedProducts);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [error, setError] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    // Reset all states when product ID changes
    setProduct(null)
    setLoading(true)
    setSelectedImage(0)
    setQuantity(1)
    setActiveTab('description')
    setError(false)
    
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true)
      setError(false)
      const response = await axios.get(`/api/products/${productId}`)
      if (response.data) {
        setProduct(response.data)
        return
      }
    } catch (error) {
      console.log('API product fetch failed, trying local...')
    }
    // Fallback to localStorage
    const storedProducts = JSON.parse(localStorage.getItem('mh_products') || '[]')
    const foundProduct = storedProducts.find((p: Product) => p._id === productId)
    
    if (foundProduct) {
      setProduct({
        ...foundProduct,
        images: foundProduct.images || [foundProduct.image || '/public/logo.png'].filter(Boolean),
        specifications: foundProduct.specifications || {
          movement: 'Automatic',
          caseSize: '41mm',
          waterResistance: '100m',
          crystal: 'Sapphire',
          bracelet: 'Stainless Steel'
        }
      })
    } else {
      setError(true)
      setProduct(null)
    }
    setLoading(false)
  }

  const handleAddToCart = () => {
    if (!product) return
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity
    })
    toast.success('Added to cart')
  }

  const handleBuyNow = () => {
    handleAddToCart()
    window.location.href = '/checkout'
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square skeleton"></div>
            <div className="space-y-6">
              <div className="h-10 skeleton w-3/4"></div>
              <div className="h-8 skeleton w-1/4"></div>
              <div className="h-32 skeleton"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl text-accent-white mb-4">Product Not Found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <span className="font-body text-sm text-accent-silver/60">
            Home / Shop / {product.name}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square bg-primary-light flex items-center justify-center overflow-hidden mb-4">
              {product.images[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-64 h-64 rounded-full border border-accent-silver/20 flex items-center justify-center">
                  <Clock className="w-24 h-24 text-accent-silver/40" />
                </div>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-4">
                <button className="p-2 border border-white/10 hover:border-accent-silver transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-4 overflow-x-auto">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 flex-shrink-0 border ${
                        selectedImage === idx ? 'border-accent-silver' : 'border-white/10'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <button className="p-2 border border-white/10 hover:border-accent-silver transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-24"
          >
            <h1 className="font-heading text-3xl md:text-4xl text-accent-white mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
PKR {product.price.toLocaleString('en-PK')}
              <span className="flex items-center gap-2 text-accent-silver/40 text-sm">
                <Check className="w-4 h-4" /> In Stock
              </span>
            </div>

            <p className="font-body text-accent-silver/60 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-6 mb-8">
              <span className="font-body text-sm text-accent-silver">Quantity</span>
              <div className="flex items-center gap-4 border border-white/10">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:text-accent-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-body text-lg w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:text-accent-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="luxury-btn flex-1"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="luxury-btn-primary flex-1"
              >
                Buy Now
              </button>
              <button className="p-4 border border-white/10 hover:border-accent-silver transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-4 border border-white/10 hover:border-accent-silver transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-t border-white/10">
              <div className="flex gap-8 mb-6">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`font-body text-sm py-4 border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-accent-silver text-accent-white'
                        : 'border-transparent text-accent-silver/60 hover:text-accent-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === 'description' && (
                <div className="py-4">
                  <p className="font-body text-lg text-black leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}



{activeTab === 'reviews' && (
                <div className="py-4 space-y-6">
                  <div className="border-t border-white/10 pt-6">
                    {[{
                      name: 'Ahmed Khan',
                      rating: 5,
                      date: '2024-01-15',
                      comment: 'Exceptional craftsmanship. The movement is smooth and the finishing is impeccable.'
                    }, {
                      name: 'Ayesha Malik',
                      rating: 5,
                      date: '2024-01-12',
                      comment: 'Stunning design with perfect proportions. Feels substantial on the wrist.'
                    }, {
                      name: 'Bilal Ahmed',
                      rating: 4,
                      date: '2024-01-10',
                      comment: 'Beautiful watch. Delivery was prompt and packaging excellent.'
                    }].map((review, idx) => (
                      <div key={idx} className="flex gap-4 mb-6 pb-6 border-b border-white/5 last:border-b-0">
                        <div className="w-12 h-12 bg-accent-silver/20 rounded-full flex items-center justify-center">
                          <span className="font-heading text-sm">{review.name.split(' ')[0][0]}{review.name.split(' ')[1]?.[0] || ''}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex text-accent-gold">
                              {Array(review.rating).fill(0).map((_, i) => (
                                <Check key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                            <span className="font-body text-xs text-accent-silver">{review.date}</span>
                          </div>
                          <h4 className="font-body text-accent-white font-semibold mb-1">{review.name}</h4>
                          <p className="font-body text-sm text-accent-silver/80">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="font-body text-xs text-accent-silver/60 text-center pt-6 border-t border-white/10">
                    Be the next to review this product.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Other Products */}
        <section className="mt-20">
          <h2 className="font-heading text-2xl text-accent-white mb-8">Other Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(1).map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="luxury-card group cursor-pointer"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="aspect-[4/5] bg-primary-light flex items-center justify-center overflow-hidden img-zoom-container">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover img-zoom"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full border border-accent-silver/20 flex items-center justify-center">
                        <Clock className="w-16 h-16 text-accent-silver/40" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-6">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-heading text-xl text-accent-white mb-2 group-hover:text-accent-silver transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="font-body text-sm text-accent-silver/60 mb-4">
                    {product.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xl text-accent-white">PKR {product.price.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProductPage
