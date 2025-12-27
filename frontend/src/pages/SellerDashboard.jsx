import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getSellerProfile } from '../api/client'
import Navbar from '../components/Navbar'

const SellerDashboard = () => {
  const { user: authUser, login } = useAuth()
  const [sellerData, setSellerData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getSellerProfile()
        setSellerData(result.user)
        // Update auth context with latest data
        login(result.user)
      } catch (error) {
        console.error('Error fetching seller profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (authUser && authUser.role === 'SELLER' && authUser.sellerStatus === 'APPROVED') {
      fetchProfile()
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
            <h2 className="text-2xl font-semibold mb-4">
              Welcome, {user?.sellerProfile?.brandName || user?.username}!
            </h2>
            <p className="text-green-400 mb-4">✓ Your seller account is approved</p>
          </div>

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
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard

