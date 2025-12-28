import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProducts, getTrendingProducts } from '../api/client'
import Navbar from '../components/Navbar'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [trendingEarrings, setTrendingEarrings] = useState([])
  const [trendingGlasses, setTrendingGlasses] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all') // all, earrings, glasses

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [earringsResult, glassesResult, allResult] = await Promise.all([
          getTrendingProducts('earrings', 6),
          getTrendingProducts('glasses', 6),
          getProducts()
        ])
        setTrendingEarrings(earringsResult.products || [])
        setTrendingGlasses(glassesResult.products || [])
        setAllProducts(allResult.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = allProducts.filter(product => {
    if (categoryFilter === 'all') return true
    return product.category === categoryFilter
  })

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
          <h1 className="text-4xl font-bold mb-8">Welcome, {user?.username}!</h1>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">🔥 Trending Earrings</h2>
            {trendingEarrings.length === 0 ? (
              <p className="text-white/70">No trending earrings yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {trendingEarrings.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/tryon/${product.id}`)}
                    className="glass-panel p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                  >
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
                    <h3 className="font-semibold truncate text-sm mb-1">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-400 font-semibold text-sm">${product.price}</span>
                      <span className="text-xs text-white/70">👁️ {product.tryOnCount}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/tryon/${product.id}`)
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                      >
                        Upload Image
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/tryon/${product.id}?mode=live`)
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                      >
                        Try Live
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">🔥 Trending Glasses</h2>
            {trendingGlasses.length === 0 ? (
              <p className="text-white/70">No trending glasses yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {trendingGlasses.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/tryon/${product.id}`)}
                    className="glass-panel p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                  >
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
                    <h3 className="font-semibold truncate text-sm mb-1">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-400 font-semibold text-sm">${product.price}</span>
                      <span className="text-xs text-white/70">👁️ {product.tryOnCount}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/tryon/${product.id}`)
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                      >
                        Upload Image
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/tryon/${product.id}?mode=live`)
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                      >
                        Try Live
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">All Products</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    categoryFilter === 'all' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setCategoryFilter('earrings')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    categoryFilter === 'earrings' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  Earrings
                </button>
                <button
                  onClick={() => setCategoryFilter('glasses')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    categoryFilter === 'glasses' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  Glasses
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <p className="text-white/70">No products available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/tryon/${product.id}`)}
                    className="glass-panel p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                  >
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
                    <h3 className="font-semibold truncate mb-1">{product.name}</h3>
                    <p className="text-sm text-white/70 capitalize mb-2">{product.category}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-purple-400 font-semibold">${product.price}</span>
                      <span className="text-xs text-white/70">👁️ {product.tryOnCount}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/tryon/${product.id}`)
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                      >
                        Upload Image
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/tryon/${product.id}?mode=live`)
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                      >
                        Try Live
                      </button>
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

export default Dashboard

