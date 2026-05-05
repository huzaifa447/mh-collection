import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Message sent! We will respond within 24 hours.')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setSubmitted(true)
    } catch (error) {
      toast.error('Failed to send - try again')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 lg:py-32"
        >
          <span className="inline-block bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-body text-sm uppercase tracking-[0.3em] mb-6">
            Get In Touch
          </span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Contact MH Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-body text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Schedule your private viewing or inquire about our exclusive collection. 
            Our specialists are here to assist you.
          </motion.p>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
          {/* Contact Cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 lg:max-w-lg"
          >
            {/* Phone */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-500"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">Call Us</h3>
                  <a href="tel:+923005963909" className="font-body text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors block">
                    +92 300 5963909
                  </a>
                  <p className="font-body text-sm text-gray-500 mt-1">Available 10AM - 8PM PKT</p>
                </div>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-500"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Email Us</h3>
                  <a href="mailto:info@mhcollection.com" className="font-body text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors break-all">
                    info@mhcollection.com
                  </a>
                  <p className="font-body text-sm text-gray-500 mt-1">Response within 24 hours</p>
                </div>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-500"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Business Hours</h3>
                  <div className="space-y-1">
                    <p className="font-body text-sm font-medium text-gray-900">Mon - Sat: 10:00 AM - 8:00 PM</p>
                    <p className="font-body text-sm font-medium text-gray-900">Sunday: Closed</p>
                  </div>
                  <p className="font-body text-xs text-gray-500 mt-2">PKT Time Zone</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:max-w-lg">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 ring-1 ring-gray-200/50">
            
              <div className="text-center mb-10">
                <h3 className="font-heading text-3xl font-bold text-gray-900 mb-3">Send Message</h3>
                <p className="font-body text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                  Fill the form below. We&apos;ll respond within 24 hours.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-body text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="luxury-input focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="luxury-input focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="luxury-input focus:ring-orange-500 focus:border-orange-500"
                      placeholder="+92 300 1234567"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="luxury-input focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select inquiry type...</option>
                    <option value="appointment">Book Appointment</option>
                    <option value="product">Product Inquiry</option>
                    <option value="service">After Sales Service</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-body text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="luxury-input focus:ring-emerald-500 focus:border-emerald-500 resize-vertical"
                    placeholder="Tell us about your requirements..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="luxury-btn-primary w-full h-14 text-lg font-semibold flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>

              {submitted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="font-heading text-xl font-semibold text-emerald-900 mb-2">Thank You!</h4>
                  <p className="font-body text-emerald-800">Your message has been sent. We will contact you within 24 hours.</p>
                </motion.div>
              )}
            </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact
