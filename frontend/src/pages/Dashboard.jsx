import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#302649] text-white">
      <Navbar />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">User Dashboard</h1>
          <div className="glass-panel p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              Welcome, {user?.username}!
            </h2>
            <p className="text-white/70 mb-6">
              You are currently a regular user.
            </p>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="text-white/80 text-sm mb-3">
                Want to become a seller?
              </p>
              <p className="text-white/60 text-xs mb-4">
                To become a seller, you need to sign up with the Seller role. Please create a new account selecting "Seller" during registration.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="btn-primary w-full"
              >
                Sign Up as Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

