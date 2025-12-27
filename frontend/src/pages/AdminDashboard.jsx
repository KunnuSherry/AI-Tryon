import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getPendingSellers, approveSeller, rejectSeller } from '../api/client'
import Navbar from '../components/Navbar'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [pendingSellers, setPendingSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)

  useEffect(() => {
    const fetchPendingSellers = async () => {
      try {
        const result = await getPendingSellers()
        setPendingSellers(result.sellers)
      } catch (error) {
        console.error('Error fetching pending sellers:', error)
        alert('Error loading pending sellers: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    if (user && user.role === 'ADMIN') {
      fetchPendingSellers()
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
            <p className="text-white/70">Manage seller applications and user accounts.</p>
          </div>

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
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

