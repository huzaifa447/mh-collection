import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  authLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Admin credentials - only this user can be admin
const ADMIN_EMAIL = 'huzaifaarif797@gmail.com'
const ADMIN_PASSWORD = 'Huzaifa_2009'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Generate a simple token
const generateToken = (email: string, isAdmin: boolean) => {
  return btoa(`${email}:${Date.now()}:${isAdmin}`)
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load from localStorage
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Check for admin login first
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        _id: 'admin-001',
        name: 'Huzaifa Arif',
        email: ADMIN_EMAIL,
        isAdmin: true
      }
      const adminToken = generateToken(email, true)
      
      localStorage.setItem('token', adminToken)
      localStorage.setItem('user', JSON.stringify(adminUser))
      setToken(adminToken)
      setUser(adminUser)
      axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`
      return
    }
    
    // Check regular users
    const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    
    if (!foundUser) {
      throw new Error('Invalid credentials')
    }
    
    const { password: _, ...userWithoutPassword } = foundUser
    const newToken = generateToken(email, false)
    
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))
    setToken(newToken)
    setUser(userWithoutPassword)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  const register = async (name: string, email: string, password: string) => {
    // LocalStorage fallback (no backend needed)
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User already exists')
    }
    
    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      password, // Plain text for localStorage demo
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      isAdmin: false
    }
    
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    const token = btoa(`${email}:${Date.now()}:false`)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(token)
    setUser(newUser)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return
    
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    // Update in users array
    if (!user.isAdmin) {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = users.map((u: any) => 
        u.email === user.email ? { ...u, ...data } : u
      )
      localStorage.setItem('users', JSON.stringify(updatedUsers))
    }
  }

return (
    <AuthContext.Provider value={{ user, token, loading: loading, authLoading: loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
