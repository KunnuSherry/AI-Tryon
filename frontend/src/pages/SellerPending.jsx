import React from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const SellerPending = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#302649] text-white">
      <Navbar />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Seller Application Status</h1>
          <div className="glass-panel p-8 rounded-lg text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">⏳</div>
              <h2 className="text-2xl font-semibold mb-4">Verification Under Review</h2>
              <p className="text-white/70">
                Your seller application is currently being reviewed by our admin team.
                You will be notified once your application has been processed.
              </p>
            </div>
            {user?.sellerProfile && (
              <div className="mt-8 text-left bg-white/5 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Your Application Details</h3>
                <div className="space-y-2 text-sm">
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
    </div>
  )
}

export default SellerPending

