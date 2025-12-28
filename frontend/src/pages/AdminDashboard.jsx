import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getPendingSellers, approveSeller, rejectSeller, getPendingProducts, approveProduct, rejectProduct } from '../api/client'
import Navbar from '../components/Navbar'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [pendingSellers, setPendingSellers] = useState([])
  const [pendingProducts, setPendingProducts] = useState([])
  const [activeTab, setActiveTab] = useState('sellers') // 'sellers' or 'products'
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sellersResult, productsResult] = await Promise.all([
          getPendingSellers(),
          getPendingProducts()
        ])
        setPendingSellers(sellersResult.sellers || [])
        setPendingProducts(productsResult.products || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('Error loading data: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    if (user && user.role === 'ADMIN') {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [user])

  const handleApprove = async (sellerId) => {
    setProcessing(sellerId)
    try {
      await approveSeller(sellerId)
      setPendingSellers(pendingSellers.filter(seller => seller.id !== sellerId))
      alert('Seller approved successfully!')
    } catch (error) {
      alert('Error approving seller: ' + error.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (sellerId) => {
    if (!confirm('Are you sure you want to reject this seller application?')) {
      return
    }
    setProcessing(sellerId)
    try {
      await rejectSeller(sellerId)
      setPendingSellers(pendingSellers.filter(seller => seller.id !== sellerId))
      alert('Seller rejected successfully!')
    } catch (error) {
      alert('Error rejecting seller: ' + error.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleApproveProduct = async (productId) => {
    setProcessing(productId)
    try {
      await approveProduct(productId)
      setPendingProducts(pendingProducts.filter(product => product.id !== productId))
      alert('Product approved successfully!')
    } catch (error) {
      alert('Error approving product: ' + error.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleRejectProduct = async (productId) => {
    if (!confirm('Are you sure you want to reject this product?')) {
      return
    }
    setProcessing(productId)
    try {
      await rejectProduct(productId)
      setPendingProducts(pendingProducts.filter(product => product.id !== productId))
      alert('Product rejected successfully!')
    } catch (error) {
      alert('Error rejecting product: ' + error.message)
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#302649] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#302649] flex items-center justify-center">
        <div className="text-white text-xl">Access Denied</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#302649] text-white">
      <Navbar />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
          
          <div className="glass-panel p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-2">Welcome, Admin!</h2>
            <p className="text-white/70">Manage seller applications and product approvals.</p>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('sellers')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeTab === 'sellers' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Pending Sellers ({pendingSellers.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeTab === 'products' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Pending Products ({pendingProducts.length})
            </button>
          </div>

          {activeTab === 'sellers' && (
          <div className="glass-panel p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              Pending Seller Applications ({pendingSellers.length})
            </h3>

            {pendingSellers.length === 0 ? (
              <p className="text-white/70 text-center py-8">No pending applications</p>
            ) : (
              <div className="space-y-4">
                {pendingSellers.map((seller) => (
                  <div key={seller.id} className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-white/70">Username:</span>
                        <span className="ml-2">{seller.username}</span>
                      </div>
                      <div>
                        <span className="text-white/70">Email:</span>
                        <span className="ml-2">{seller.email}</span>
                      </div>
                      {seller.sellerProfile && (
                        <>
                          <div>
                            <span className="text-white/70">Brand Name:</span>
                            <span className="ml-2">{seller.sellerProfile.brandName}</span>
                          </div>
                          <div>
                            <span className="text-white/70">Business Email:</span>
                            <span className="ml-2">{seller.sellerProfile.businessEmail}</span>
                          </div>
                          <div>
                            <span className="text-white/70">GST Number:</span>
                            <span className="ml-2">{seller.sellerProfile.gstNumber}</span>
                          </div>
                          <div>
                            <span className="text-white/70">Address:</span>
                            <span className="ml-2">{seller.sellerProfile.address}</span>
                          </div>
                        </>
                      )}
                      <div>
                        <span className="text-white/70">Applied on:</span>
                        <span className="ml-2">
                          {new Date(seller.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={() => handleApprove(seller.id)}
                        disabled={processing === seller.id}
                        className="btn-primary px-6 py-2 disabled:opacity-50"
                      >
                        {processing === seller.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(seller.id)}
                        disabled={processing === seller.id}
                        className="px-6 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {processing === seller.id ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {activeTab === 'products' && (
          <div className="glass-panel p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              Pending Products ({pendingProducts.length})
            </h3>

            {pendingProducts.length === 0 ? (
              <p className="text-white/70 text-center py-8">No pending products</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingProducts.map((product) => (
                  <div key={product.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="aspect-square bg-white/10 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {product.image?.original ? (
                        <img
                          src={`http://localhost:5000${product.image.original}`}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-white/50">No Image</span>
                      )}
                    </div>
                    <h4 className="font-semibold mb-1">{product.name}</h4>
                    <p className="text-sm text-white/70 capitalize mb-2">{product.category}</p>
                    <p className="text-sm text-white/70 mb-2">${product.price}</p>
                    <p className="text-xs text-white/60 mb-3">
                      Seller: {product.sellerName || 'Unknown'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveProduct(product.id)}
                        disabled={processing === product.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        {processing === product.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleRejectProduct(product.id)}
                        disabled={processing === product.id}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        {processing === product.id ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

