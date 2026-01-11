import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="glass-panel p-4 mb-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="text-white text-xl font-bold cursor-pointer"
          onClick={() => {
            if (user?.role === 'ADMIN') {
              navigate('/admin/dashboard')
            } else if (user?.role === 'SELLER' && user?.sellerStatus === 'APPROVED') {
              navigate('/seller/dashboard')
            } else {
              navigate('/dashboard')
            }
          }}
        >
          AI Tryon
        </div>
        <div className="flex items-center gap-4">
          {(user?.role === 'USER' || !user?.role) && (
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 text-sm transition-colors"
            >
              My Profile
            </button>
          )}
          <span className="text-white/70 text-sm">
            {user?.username || user?.email}
          </span>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 rounded-full border border-white/30 text-white hover:bg-white/10 text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
