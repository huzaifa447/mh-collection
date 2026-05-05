import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useAnimation } from 'framer-motion'
import { ArrowRight, ChevronDown, Clock, Shield, Sparkles, Package } from 'lucide-react'
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

const Home = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const slides = [
    '/slideimages/Blue and White Bold Watch Sale Facebook Shops Ad_20250904_215346_0000.png',
    '/slideimages/Blue and White Bold Watch Sale Facebook Shops Ad_20250905_193113_0000.png',
    '/slideimages/Blue and White Bold Watch Sale Facebook Shops Ad_20250905_193243_0000.png',
    '/slideimages/Blue and White Bold Watch Sale Facebook Shops Ad_20250909_145129_0000.png'
  ]

  const totalSlides = slides.length

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 2500)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/products?sort=newest')
      setProducts(response.data)
    } catch {
      const storedProducts = JSON.parse(localStorage.getItem('mh_products') || '[]')
        .map((p: Product) => ({ ...p, description: p.description || '' }))
        .sort((a: any, b: any) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 3);
      setProducts(storedProducts as Product[]);
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const reviewSlideContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.15 
      }
    }
  }

  const reviewSlideItem = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Announcement Bar */}
        <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center py-2 md:py-3 text-xs font-medium uppercase tracking-wide shadow-md z-40">
        🚚 Free Delivery All Over Pakistan 
      </div>
      
      {/* Hero Slide Banner Section */}
      <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-screen overflow-hidden">
        {/* Slide Images */}
        <div className="absolute inset-0 w-full h-full">
          {slides.map((slide, index) => (
            <motion.img
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover absolute inset-0 transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(${(index - currentSlide) * 100}%)`
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          ))}
        </div>

        {/* Light overlay for clearer images */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 z-10"></div>

        {/* No overlay text - pure image banner */}

        {/* Navigation Dots */}
        <div className="absolute bottom-8 md:bottom-20 lg:bottom-24 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125 shadow-lg'
                  : 'bg-white/50 hover:bg-white hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-8 bg-white/80 backdrop-blur-sm rounded-full"
          />
        </motion.div>

        {/* Pause on Hover */}
        <div 
          className="absolute inset-0 z-30"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        />
      </section>

      {/* Featured Products Preview */}
      <section className="section-padding bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="inline-block font-body text-xs tracking-[0.3em] text-accent-silver mb-4">
              FEATURED
            </motion.span>
            <motion.h2 variants={fadeInUp} className="font-heading text-3xl md:text-5xl text-accent-white mb-6">
              Exceptional Timepieces
            </motion.h2>
            <motion.p variants={fadeInUp} className="font-body text-accent-silver/60 max-w-xl mx-auto">
              Each piece in our collection represents the pinnacle of watchmaking excellence.
            </motion.p>
          </motion.div>

          {/* Product Cards Placeholder */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {loading ? (
              <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3].map((i) => (
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
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="font-body text-sm text-accent-silver/60">
                  No products yet. Visit admin panel to add.
                </p>
              </div>
            ) : (
              products.slice(0, 3).map((product, index) => (
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
                            ;(e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-40 h-40 rounded-full border border-accent-silver/20 flex items-center justify-center group-hover:border-accent-silver/40 transition-all duration-500"><Clock className="w-16 h-16 text-accent-silver/40 group-hover:text-accent-silver transition-colors duration-500" /></div>'
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
                      <span className="font-heading text-xl text-accent-white">PKR {product.price.toLocaleString('en-PK')}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(product)
                        }}
                        className="luxury-btn py-2 px-4 text-xs"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/shop" className="luxury-btn inline-flex items-center space-x-2">
              <span>View All Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.span 
              variants={fadeInUp} 
              className="inline-block font-body text-xs tracking-[0.3em] text-accent-silver mb-4"
            >
              TESTIMONIALS
            </motion.span>
            <motion.h2 
              variants={fadeInUp} 
              className="font-heading text-3xl md:text-4xl lg:text-5xl text-accent-white mb-6 leading-tight"
            >
              What Our Clients Say
            </motion.h2>
            <motion.p 
              variants={fadeInUp} 
              className="font-body text-accent-silver/70 max-w-2xl mx-auto text-base md:text-lg"
            >
              Trusted by watch enthusiasts across Pakistan
            </motion.p>
          </motion.div>

          <motion.div
            className="overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={reviewSlideContainer}
          >
            <div className="flex gap-6 lg:gap-8">
              {[
                {
                  name: "Ahmed Khan",
                  location: "Lahore",
                  rating: 5,
                  review: "Exquisite craftsmanship and timeless elegance. The MH Daytona is a masterpiece that turns heads everywhere. Worth every penny. Service was impeccable.",
                  avatar: "A"
                },
                {
                  name: "Fatima Ali",
                  location: "Karachi",
                  rating: 5,
                  review: "My husband's dream watch. Attention to detail and quality unmatched. MH Collection exceeded all expectations. Highly recommended!",
                  avatar: "F"
                },
                {
                  name: "Omar Sheikh",
                  location: "Islamabad",
                  rating: 5,
                  review: "Perfect blend of luxury and precision. Impeccable service from consultation to delivery. A true investment in timeless style.",
                  avatar: "O"
                },
                {
                  name: "Ayesha Malik",
                  location: "Faisalabad",
                  rating: 5,
                  review: "Stunning anniversary gift. Flawless movement and sophisticated design. MH Collection delivered perfection beyond expectations.",
                  avatar: "A"
                }
              ].map((review, index) => (
                <motion.div
                  key={index}
                  variants={reviewSlideItem}
                  className="luxury-card flex-1 min-w-[90vw] md:min-w-[45vw] lg:min-w-[25vw] p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-white/10 backdrop-blur-sm bg-white/5 rounded-2xl"
                >
                  <div className="flex items-start mb-6 gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-gold to-accent-silver rounded-2xl flex items-center justify-center font-heading text-2xl font-bold shadow-xl shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-xl md:text-2xl text-accent-white font-bold mb-1 leading-tight">
                        {review.name}
                      </h4>
                      <p className="font-body text-sm md:text-base text-accent-silver/80 font-medium mb-3 capitalize">
                        {review.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-6 gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <svg key={i} className="w-6 h-6 text-yellow-400 fill-current shadow-lg" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    {Array.from({ length: 5 - review.rating }).map((_, i) => (
                      <svg key={i} className="w-6 h-6 text-accent-silver/50" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <p className="font-body text-accent-silver/90 italic leading-relaxed text-sm md:text-base line-clamp-4">
                    "{review.review}"
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(192, 192, 192, 0.2) 0%, transparent 50%)`
        }}></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block font-body text-xs tracking-[0.3em] text-accent-silver mb-4"
          >
            BEGIN YOUR JOURNEY
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-5xl text-accent-white mb-6"
          >
            Experience Timeless Elegance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-body text-lg text-accent-silver/60 mb-10"
          >
            Visit our boutique or schedule a private consultation to explore our collection.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/shop" className="luxury-btn luxury-btn-primary">
              Shop Now
            </Link>
            <Link to="/contact" className="luxury-btn">
              Book Appointment
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
