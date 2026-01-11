import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getSellerProfile, getSellerProducts, getTrendingProducts } from '../api/client'
import { getImageUrl } from '../utils/imageUtils'
import Navbar from '../components/Navbar'

const SellerDashboard = () => {
  const { user: authUser, login } = useAuth()
  const navigate = useNavigate()
  const [sellerData, setSellerData] = useState(null)
  const [products, setProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResult, productsResult, trendingResult] = await Promise.all([
          getSellerProfile(),
          getSellerProducts(),
          getTrendingProducts()
        ])
        setSellerData(profileResult.user)
        setProducts(productsResult.products || [])
        setTrendingProducts(trendingResult.products || [])
        // Update auth context with latest data
        login(profileResult.user)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (authUser && authUser.role === 'SELLER' && authUser.sellerStatus === 'APPROVED') {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [authUser, login])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#302649] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const user = sellerData || authUser

  return (
    <div className="min-h-screen bg-[#302649] text-white">
      <Navbar />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Seller Dashboard</h1>
          
          <div className="glass-panel p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  Welcome, {user?.sellerProfile?.brandName || user?.username}!
                </h2>
                <p className="text-green-400">✓ Your seller account is approved</p>
              </div>
              <button
                onClick={() => navigate('/seller/products/add')}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                + Add Product
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {user?.sellerProfile && (
              <div className="glass-panel p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Business Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-white/70">Brand Name:</span>
                    <span className="ml-2">{user.sellerProfile.brandName}</span>
                  </div>
                  <div>
                    <span className="text-white/70">Business Email:</span>
                    <span className="ml-2">{user.sellerProfile.businessEmail}</span>
                  </div>
                  <div>
                    <span className="text-white/70">GST Number:</span>
                    <span className="ml-2">{user.sellerProfile.gstNumber}</span>
                  </div>
                  <div>
                    <span className="text-white/70">Address:</span>
                    <span className="ml-2">{user.sellerProfile.address}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="glass-panel p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">My Products</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Products:</span>
                  <span className="font-semibold">{products.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Approved:</span>
                  <span className="text-green-400 font-semibold">
                    {products.filter(p => p.status === 'APPROVED').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span className="text-yellow-400 font-semibold">
                    {products.filter(p => p.status === 'PENDING').length}
                  </span>
                </div>
                <button
                  onClick={() => navigate('/seller/products')}
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                >
                  View All Products
                </button>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">My Recent Products</h3>
            {products.length === 0 ? (
              <p className="text-white/70">No products yet. Add your first product!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.slice(0, 3).map((product) => (
                  <div key={product.id} className="bg-white/5 p-4 rounded-lg">
                    <div className="aspect-square bg-white/10 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                      {product.image?.original ? (
                        <img
                          src={getImageUrl(product.image.original)}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-white/50">No Image</span>
                      )}
                    </div>
                    <h4 className="font-semibold truncate">{product.name}</h4>
                    <p className="text-sm text-white/70">{product.category}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-purple-400 font-semibold">${product.price}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          product.status === 'APPROVED'
                            ? 'bg-green-500/20 text-green-400'
                            : product.status === 'PENDING'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">🔥 Trending Products (Global)</h3>
            {trendingProducts.length === 0 ? (
              <p className="text-white/70">No trending products yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {trendingProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="bg-white/5 p-4 rounded-lg">
                    <div className="aspect-square bg-white/10 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                      {product.image?.original ? (
                        <img
                          src={getImageUrl(product.image.original)}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-white/50">No Image</span>
                      )}
                    </div>
                    <h4 className="font-semibold truncate">{product.name}</h4>
                    <p className="text-sm text-white/70">{product.category}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-purple-400 font-semibold">${product.price}</span>
                      <span className="text-xs text-white/70">👁️ {product.tryOnCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard

