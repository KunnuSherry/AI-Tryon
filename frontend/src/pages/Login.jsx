import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/client'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login: setAuthUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(formData.emailOrUsername, formData.password)
      
      // Update auth context
      setAuthUser(response.user)

      // Redirect based on role and status
      if (response.user.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else if (response.user.role === 'SELLER') {
        if (response.user.sellerStatus === 'APPROVED') {
          navigate('/seller/dashboard')
        } else {
          navigate('/seller/pending')
        }
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      setError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col lg:flex-row w-full min-h-screen bg-[#302649]'>
      <div className='lg:w-4/6 w-full h-[40vh] lg:h-[100vh]'>
        <video src="login.mp4" autoPlay muted loop className='w-full h-full object-cover'></video>
      </div>
      <div className='glass-panel relative w-full lg:w-2/6 h-full min-h-[60vh] lg:min-h-[100vh] flex flex-col items-center justify-center gap-8 px-8 py-12 overflow-y-auto'>
        <div className='w-full max-w-sm space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-white text-4xl md:text-5xl font-bold leading-tight'>
              Welcome Back
            </h1>
            <p className='text-white/60 text-sm'>
              Sign in to continue your journey
            </p>
          </div>
        
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
          {error && (
            <div className='bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm backdrop-blur-sm'>
              <div className='flex items-center gap-2'>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <input
            type="text"
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleChange}
            placeholder="Email or Username"
            className='input-field'
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className='input-field'
            required
          />

          <button
            type="submit"
            disabled={loading}
            className='btn-primary mt-2'
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className='text-center text-white/70 text-sm'>
          Don't have an account?{' '}
          <Link to="/signup" className='text-[#8f88ff] hover:text-[#a59fff] font-medium transition-colors'>
            Sign up
          </Link>
        </div>
        </div>

        <div className='droplet drop-one'></div>
        <div className='droplet drop-two'></div>
        <div className='droplet drop-three'></div>
      </div>
    </div>
  )
}

export default Login

