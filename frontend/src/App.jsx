import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import SellerApply from './pages/SellerApply'
import SellerPending from './pages/SellerPending'
import SellerDashboard from './pages/SellerDashboard'
import AddProduct from './pages/AddProduct'
import SellerProducts from './pages/SellerProducts'
import AdminDashboard from './pages/AdminDashboard'
import TryOn from './pages/TryOn'
import UserProfile from './pages/UserProfile'
import ProtectedRoute from './components/ProtectedRoute'

// Component to check auth and redirect if logged in
const AuthCheck = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#302649] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Component to handle role-based redirects
const RoleBasedRedirect = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#302649] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Redirect based on role and status
  if (user.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />
  } else if (user.role === 'SELLER') {
    if (user.sellerStatus === 'APPROVED') {
      return <Navigate to="/seller/dashboard" replace />
    } else if (user.sellerStatus === 'PENDING') {
      // Check if seller has submitted profile
      if (!user.sellerProfile || !user.sellerProfile.brandName) {
        return <Navigate to="/seller/apply" replace />
      }
      return <Navigate to="/seller/pending" replace />
    }
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              <AuthCheck>
                <Login />
              </AuthCheck>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AuthCheck>
                <Signup />
              </AuthCheck>
            } 
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedRedirect>
                  <Dashboard />
                </RoleBasedRedirect>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/apply"
            element={
              <ProtectedRoute>
                <SellerApply />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/pending"
            element={
              <ProtectedRoute>
                <SellerPending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/products/add"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/products"
            element={
              <ProtectedRoute>
                <SellerProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tryon/:id"
            element={
              <ProtectedRoute>
                <TryOn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
