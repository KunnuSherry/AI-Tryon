import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { applySeller } from '../api/client'
import Navbar from '../components/Navbar'

const SellerApply = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    brandName: '',
    businessEmail: '',
    gstNumber: '',
    address: '',
  })

  // Redirect if not a SELLER with PENDING status
  React.useEffect(() => {
    if (user && user.role !== 'SELLER') {
      navigate('/dashboard')
    } else if (user && user.sellerStatus !== 'PENDING') {
      if (user.sellerStatus === 'APPROVED') {
        navigate('/seller/dashboard')
      } else {
        navigate('/dashboard')
      }
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await applySeller(formData)
      navigate('/seller/pending')
    } catch (error) {
      setError(error.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!user || user.role !== 'SELLER' || user.sellerStatus !== 'PENDING') {
    return null
  }

  return (
    <div className="min-h-screen bg-[#302649] text-white">
      <Navbar />
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Complete Your Seller Profile</h1>
          <div className="glass-panel p-8 rounded-lg">
            {error && (
              <div className='bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm mb-6'>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Business Email</label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your business email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">GST Number</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your GST number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Business Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="input-field resize-none"
                  placeholder="Enter your business address"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerApply

