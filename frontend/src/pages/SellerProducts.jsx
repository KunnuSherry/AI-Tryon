import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getSellerProducts } from '../api/client'
import { getImageUrl } from '../utils/imageUtils'
import Navbar from '../components/Navbar'

const SellerProducts = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, approved, pending, rejected

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getSellerProducts()
        setProducts(result.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.role === 'SELLER') {
      fetchProducts()
    }
  }, [user])

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true
    return product.status === filter.toUpperCase()
  })

  const getStatusBadge = (status) => {
    const styles = {
      APPROVED: 'bg-green-500/20 text-green-400',
      PENDING: 'bg-yellow-500/20 text-yellow-400',
      REJECTED: 'bg-red-500/20 text-red-400',
    }
    return (
      <span className={`text-xs px-2 py-1 rounded ${styles[status] || ''}`}>
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#302649] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#302649] text-white">
      <Navbar />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">My Products</h1>
            <button
              onClick={() => navigate('/seller/products/add')}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              + Add Product
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'approved' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Approved ({products.filter(p => p.status === 'APPROVED').length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Pending ({products.filter(p => p.status === 'PENDING').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'rejected' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Rejected ({products.filter(p => p.status === 'REJECTED').length})
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="glass-panel p-12 rounded-lg text-center">
              <p className="text-white/70 text-lg mb-4">No products found.</p>
              <button
                onClick={() => navigate('/seller/products/add')}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="glass-panel p-4 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="aspect-square bg-white/10 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
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
                  <h3 className="font-semibold truncate mb-1">{product.name}</h3>
                  <p className="text-sm text-white/70 capitalize mb-2">{product.category}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-400 font-semibold">${product.price}</span>
                    {getStatusBadge(product.status)}
                  </div>
                  <div className="flex justify-between items-center text-sm text-white/70">
                    <span>👁️ {product.tryOnCount} tries</span>
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellerProducts

