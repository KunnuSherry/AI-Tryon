import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTryOnHistory } from '../api/client'
import Navbar from '../components/Navbar'

const UserProfile = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tryOns, setTryOns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTryOnHistory = async () => {
      try {
        setLoading(true)
        const response = await getTryOnHistory()
        setTryOns(response.tryOns || [])
      } catch (err) {
        console.error('Error fetching try-on history:', err)
        setError('Failed to load try-on history')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchTryOnHistory()
    }
  }, [user])

  const handleDownload = (imageUrl, productName) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `tryon-${productName}-${Date.now()}.png`
    link.target = '_blank'
    link.click()
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
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 text-white/70 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>

          <div className="glass-panel p-6 rounded-lg mb-6">
            <h1 className="text-4xl font-bold mb-2">My Profile</h1>
            <div className="text-white/70">
              <p className="text-lg">Username: {user?.username}</p>
              <p className="text-sm">Email: {user?.email}</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">My Try-On History</h2>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {tryOns.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/70 text-lg mb-4">No try-ons yet</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tryOns.map((tryOn) => (
                  <div
                    key={tryOn.id}
                    className="bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-colors"
                  >
                    {tryOn.product && (
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{tryOn.product.name}</h3>
                        <p className="text-white/70 text-sm mb-2 capitalize">
                          {tryOn.category} • ${tryOn.product.price}
                        </p>
                      </div>
                    )}
                    
                    <div className="relative">
                      <img
                        src={tryOn.resultImageUrl}
                        alt="Try-on result"
                        className="w-full h-auto"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => handleDownload(tryOn.resultImageUrl, tryOn.product?.name || 'tryon')}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg"
                          title="Download image"
                        >
                          📥 Download
                        </button>
                      </div>
                    </div>

                    <div className="p-4 text-xs text-white/50">
                      {new Date(tryOn.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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

export default UserProfile
