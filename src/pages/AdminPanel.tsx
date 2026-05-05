import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ShoppingBag, Plus, Trash2, Edit, Eye, Clock, X, User, MapPin, Phone, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Product {
  _id: string
  name: string
  price: number
  category: string
  description: string
  images: string[]
}

interface Order {
  _id: string
  items: { name: string; quantity: number; price: number }[]
  totalAmount: number
  status: 'pending' | 'shipped' | 'delivered'
  createdAt: string
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string
  userEmail?: string
  user?: { name: string; email: string; phone: string; address: string; city: string }
}

const AdminPanel = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
const [activeTab, setActiveTab] = useState('orders')
  const [users, setUsers] = useState<any[]>([])
const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    images: [] as string[],
    imageUrls: ''
  })
  const [imagePreviews, setImagePreviews] = useState<{id: string, url: string}[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])

useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return
    
    if (!user?.isAdmin) {
      navigate('/login')
      return
    }
    fetchData()
  }, [user, authLoading])

const fetchData = async () => {
    try {
      // Try API first
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/admin/orders'),
        axios.get('/api/admin/users')
      ])
      setProducts(productsRes.data)
      setOrders(ordersRes.data)
setUsers(usersRes.data || [])
    } catch (error) {
      // Fallback to localStorage
      const storedProducts = JSON.parse(localStorage.getItem('mh_products') || '[]')
      const storedOrders = JSON.parse(localStorage.getItem('mh_orders') || '[]')
const storedUsers = JSON.parse(localStorage.getItem('users') || '[]').filter((u: any) => !u.isAdmin)
setProducts(storedProducts)
setOrders(storedOrders)
      setUsers(storedUsers)
    } finally {
      setLoading(false)
    }
  }

const handleImageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPreviews = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36),
      url: URL.createObjectURL(file)
    }))
    setImagePreviews(prev => [...prev, ...newPreviews])
    setImageFiles(prev => [...prev, ...files])
    
    // Update form images as data URLs for localStorage fallback
    const dataUrls = await Promise.all(files.map(file => new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })))
    setProductForm(prev => ({ ...prev, images: [...prev.images, ...dataUrls] }))
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const urls = e.target.value.split('\n').map(url => url.trim()).filter(Boolean)
    setProductForm(prev => ({ ...prev, images: [...prev.images, ...urls], imageUrls: e.target.value }))
  }

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleFormImagesChange = (images: string[]) => {
    setProductForm(prev => ({ ...prev, images }))
  }

const handleSaveProduct = async () => {
    try {
      const productData = {
        name: productForm.name,
        price: Number(productForm.price),
        category: productForm.category,
        description: productForm.description,
        images: productForm.images || []
      }
      
      // FormData for file uploads
      const formData = new FormData()
      formData.append('name', productData.name)
      formData.append('price', productData.price.toString())
      formData.append('category', productData.category)
      formData.append('description', productData.description)
      
      // Append actual file objects for upload
      imageFiles.forEach((file) => {
        formData.append('images', file)
      })
      
      // Append image URLs if provided
      const urls = productForm.imageUrls.split('\n').map((u) => u.trim()).filter(Boolean)
      if (urls.length > 0) {
        formData.append('imageUrls', JSON.stringify(urls))
      }
      
      if (editingProduct?._id) {
        formData.append('removeImages', '[]') // Optional remove logic
        await axios.put(`/api/products/${editingProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await axios.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      
      toast.success(editingProduct ? 'Product updated!' : 'Product created!')
      setShowProductModal(false)
      setEditingProduct(null)
      setProductForm({ name: '', price: '', category: '', description: '', images: [], imageUrls: '' })
      setImagePreviews([])
      setImageFiles([])
      fetchData()
    } catch (error) {

      toast.error(error.response?.data?.message || 'Error saving product')
      
      // Fallback to localStorage
      const data = {
        ...productForm,
        price: Number(productForm.price),
        _id: editingProduct?._id || Date.now().toString(),
        images: productForm.images || []
      }
      
      const storedProducts = JSON.parse(localStorage.getItem('mh_products') || '[]')
      if (editingProduct) {
        const updated = storedProducts.map((p: Product) => p._id === editingProduct._id ? data : p)
        localStorage.setItem('mh_products', JSON.stringify(updated))
      } else {
        storedProducts.push(data)
        localStorage.setItem('mh_products', JSON.stringify(storedProducts))
      }
      
      toast.success(editingProduct ? 'Product updated locally!' : 'Product created locally!')
      setShowProductModal(false)
      setEditingProduct(null)
      setProductForm({ name: '', price: '', category: '', description: '', images: [], imageUrls: '' })
      setImagePreviews([])
      setImageFiles([])
      fetchData()
    }
  }

const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    try {
      await axios.delete(`/api/products/${id}`)
      toast.success('Product deleted')
    } catch {
      const storedProducts = JSON.parse(localStorage.getItem('mh_products') || '[]')
      const filtered = storedProducts.filter((p: Product) => p._id !== id)
      localStorage.setItem('mh_products', JSON.stringify(filtered))
      toast.success('Product deleted')
    }
    fetchData()
  }

const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { status })
      toast.success('Order updated')
    } catch {
      const storedOrders = JSON.parse(localStorage.getItem('mh_orders') || '[]')
      const updated = storedOrders.map((o: Order) => o._id === orderId ? { ...o, status } : o)
      localStorage.setItem('mh_orders', JSON.stringify(updated))
      
      // Also update the 'orders' key so user can see the status in their panel
      const userOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const userOrdersUpdated = userOrders.map((o: Order) => o._id === orderId ? { ...o, status } : o)
      localStorage.setItem('orders', JSON.stringify(userOrdersUpdated))
      
      setOrders(updated)
      toast.success('Order status updated!')
    }
  }

  if (!user?.isAdmin) return null

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-heading text-4xl text-accent-white">Admin Panel</h1>
            <Link to="/" className="luxury-btn py-2 px-4 text-sm">View Site</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Products', value: products.length, icon: Package },
              { label: 'Total Orders', value: orders.length, icon: ShoppingBag },
              { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length, icon: Clock }
            ].map((stat, idx) => (
              <div key={idx} className="p-6 bg-primary-light border border-white/5">
                <stat.icon className="w-8 h-8 text-accent-silver mb-4" />
                <p className="font-heading text-3xl text-accent-white mb-1">{stat.value}</p>
                <p className="font-body text-sm text-accent-silver/60">{stat.label}</p>
              </div>
            ))}
          </div>

<div className="flex gap-4 mb-6 border-b border-white/10">
            {['orders', 'products', 'users'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-body text-sm border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-accent-silver text-accent-white'
                    : 'border-transparent text-accent-silver/60 hover:text-accent-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-primary-light border border-white/5 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-primary">
                    <tr>
                      {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Actions'].map(head => (
                        <th key={head} className="py-4 px-6 text-left font-body text-sm text-accent-silver/60">
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id} className="border-t border-white/5">
                        <td className="py-4 px-6 font-body text-accent-white">#{order._id}</td>
<td className="py-4 px-6">
                          <p className="font-body text-accent-white">{order.fullName}</p>
                          <p className="font-body text-xs text-accent-silver/60">{order.phone}</p>
                          {order.userEmail && (
                            <p className="font-body text-xs text-accent-silver/60">{order.userEmail}</p>
                          )}
                        </td>
                        <td className="py-4 px-6 font-body text-accent-silver">
                          {order.items.map((item, idx) => (
                            <p key={idx}>{item.name} x{item.quantity}</p>
                          ))}
                        </td>
                        <td className="py-4 px-6 font-body text-accent-white">
PKR {order.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="bg-primary border border-white/10 px-3 py-1 text-sm text-accent-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
<td className="py-4 px-6">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="text-accent-silver hover:text-accent-white"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

{activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => {
                    setEditingProduct(null)
                    setProductForm({ name: '', price: '', category: '', description: '', images: [], imageUrls: '' })
                    setShowProductModal(true)
                  }}
                  className="luxury-btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              <div className="bg-primary-light border border-white/5 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-primary">
                    <tr>
                      {['Product', 'Category', 'Price', 'Actions'].map(head => (
                        <th key={head} className="py-4 px-6 text-left font-body text-sm text-accent-silver/60">
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id} className="border-t border-white/5">
                        <td className="py-4 px-6 font-body text-accent-white">{product.name}</td>
                        <td className="py-4 px-6 font-body text-accent-silver">{product.category}</td>
                        <td className="py-4 px-6 font-body text-accent-white">
PKR {product.price.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 flex gap-4">
                          <button
                            onClick={() => {
setEditingProduct(product)
                              setProductForm({
                                name: product.name,
                                price: String(product.price),
                                category: product.category,
                                description: product.description,
                                images: product.images || [],
                                imageUrls: ''
                              })
                              setImagePreviews(product.images.map((img, idx) => ({
                                id: idx.toString(),
                                url: img
                              })) || [])
                              setShowProductModal(true)
                            }}
                            className="text-accent-silver hover:text-accent-white"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-primary-light border border-white/5 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-primary">
                    <tr>
                      {['Name', 'Email', 'Phone', 'City', 'Joined'].map(head => (
                        <th key={head} className="py-4 px-6 text-left font-body text-sm text-accent-silver/60">
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr className="border-t border-white/5">
                        <td colSpan={5} className="py-8 px-6 text-center font-body text-accent-silver">
                          No users registered yet
                        </td>
                      </tr>
                    ) : (
                      users.map((user: any, idx: number) => (
                        <tr key={idx} className="border-t border-white/5">
                          <td className="py-4 px-6 font-body text-accent-white">{user.name || 'N/A'}</td>
                          <td className="py-4 px-6 font-body text-accent-silver">{user.email || 'N/A'}</td>
                          <td className="py-4 px-6 font-body text-accent-silver">{user.phone || 'N/A'}</td>
                          <td className="py-4 px-6 font-body text-accent-silver">{user.city || 'N/A'}</td>
                          <td className="py-4 px-6 font-body text-accent-silver">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {showProductModal && (
        <div className="fixed inset-0 bg-primary/90 flex items-center justify-center z-50">
          <div className="bg-primary-light border border-white/5 p-8 w-full max-w-lg mx-4">
            <h3 className="font-heading text-2xl text-accent-white mb-6">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={productForm.name}
                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                className="luxury-input"
              />
              <input
                type="number"
                placeholder="Price"
                value={productForm.price}
                onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                className="luxury-input"
              />
              <select
                value={productForm.category}
                onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                className="luxury-input"
              >
                <option value="">Select Category</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="couples">Couples</option>
              </select>
<textarea
                placeholder="Description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="luxury-input resize-none"
              />
              <div>
                <label className="block font-body text-sm text-accent-silver/60 mb-2">Product Images (Max 5)</label>
                <div className="space-y-4">
                  {/* File Upload */}
                  <label className="luxury-btn cursor-pointer relative w-full text-center">
                    <span>Choose Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFilesChange}
                      className="absolute inset-0 w-full h-full"
                      style={{ opacity: 0, cursor: 'pointer' }}
                    />
                  </label>
                  
                  {/* URL Input */}
                  <div>
                    <label className="block font-body text-xs text-accent-silver/60 mb-1">Or enter image URLs (one per line)</label>
                    <textarea
                      placeholder="https://example.com/image1.jpg
https://example.com/image2.jpg"
                      value={productForm.imageUrls}
                      onChange={handleImageUrlChange}
                      rows={3}
                      className="luxury-input resize-none"
                    />
                  </div>

                  {/* Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 bg-primary-light/20 rounded border border-white/10">
                      {imagePreviews.map((preview, index) => (
                        <div key={preview.id} className="relative group">
                          <img 
                            src={preview.url} 
                            alt="Preview" 
                            className="w-full aspect-square object-cover rounded cursor-pointer"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className={`font-body text-xs ${imagePreviews.length > 4 ? 'text-red-400' : 'text-accent-silver/60'}`}>
                    {imagePreviews.length}/5 images ({productForm.images.length} total)
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={handleSaveProduct} className="luxury-btn-primary flex-1">
                Save
              </button>
              <button
                onClick={() => {
                  setShowProductModal(false)
                  setEditingProduct(null)
                }}
                className="luxury-btn flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
)}
      {selectedOrder && (
        <div className="fixed inset-0 bg-primary/90 flex items-center justify-center z-50">
          <div className="bg-primary-light border border-white/5 p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading text-2xl text-accent-white">Customer Details</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-accent-silver hover:text-accent-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-primary border border-white/5">
                <h4 className="font-heading text-lg text-accent-white mb-3">Order Information</h4>
                <div className="space-y-2">
                  <p className="font-body text-sm text-accent-silver">
                    <span className="text-accent-white">Order ID:</span> #{selectedOrder._id}
                  </p>
                  <p className="font-body text-sm text-accent-silver">
                    <span className="text-accent-white">Status:</span> {selectedOrder.status}
                  </p>
                  <p className="font-body text-sm text-accent-silver">
                    <span className="text-accent-white">Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                  <p className="font-body text-sm text-accent-silver">
PKR {selectedOrder.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-primary border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-accent-silver" />
                  <h4 className="font-heading text-lg text-accent-white">Personal Information</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-accent-silver/60" />
                    <div>
                      <p className="font-body text-xs text-accent-silver/60">Full Name</p>
                      <p className="font-body text-sm text-accent-white">{selectedOrder.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent-silver/60" />
                    <div>
                      <p className="font-body text-xs text-accent-silver/60">Email</p>
                      <p className="font-body text-sm text-accent-white">
                        {selectedOrder.userEmail || (selectedOrder.user as any)?.email || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-accent-silver/60" />
                    <div>
                      <p className="font-body text-xs text-accent-silver/60">Phone</p>
                      <p className="font-body text-sm text-accent-white">{selectedOrder.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-primary border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-accent-silver" />
                  <h4 className="font-heading text-lg text-accent-white">Shipping Address</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-body text-xs text-accent-silver/60">Address</p>
                    <p className="font-body text-sm text-accent-white">{selectedOrder.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-body text-xs text-accent-silver/60">City</p>
                      <p className="font-body text-sm text-accent-white">{selectedOrder.city}</p>
                    </div>
                    <div>
                      <p className="font-body text-xs text-accent-silver/60">Postal Code</p>
                      <p className="font-body text-sm text-accent-white">{selectedOrder.postalCode}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-primary border border-white/5">
                <h4 className="font-heading text-lg text-accent-white mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div>
                        <p className="font-body text-sm text-accent-white">{item.name}</p>
                        <p className="font-body text-xs text-accent-silver/60">Qty: {item.quantity}</p>
                      </div>
PKR {(item.price * item.quantity).toLocaleString()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setSelectedOrder(null)}
              className="luxury-btn w-full mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
