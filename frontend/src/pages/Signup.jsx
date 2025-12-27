import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../api/client'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { username, email, password, role } = formData
      const response = await signup({ username, email, password, role })
      
      // Update auth context
      login(response.user)

      // Redirect based on role
      if (response.user.role === 'SELLER') {
        navigate('/seller/pending')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      setError(error.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col lg:flex-row w-full min-h-screen bg-[#2A2C47]'>
      <div className='lg:w-4/6 w-full h-[40vh] lg:h-[100vh]'>
        <video src="signup.mp4" autoPlay muted loop className='w-full h-full object-cover'></video>
      </div>
      <div className='glass-panel relative w-full lg:w-2/6 h-full min-h-[60vh] lg:min-h-[100vh] flex flex-col items-center justify-center gap-8 px-8 py-12 overflow-y-auto'>
        <div className='w-full max-w-sm space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-white text-4xl md:text-5xl font-bold leading-tight'>
              Create Your Account
            </h1>
            <p className='text-white/60 text-sm'>
              Join us and start your journey
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
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className='input-field'
            required
            minLength={3}
            maxLength={30}
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
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
            minLength={6}
          />

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className='input-field'
            required
            minLength={6}
          />

          <div className='flex flex-col gap-2'>
            <label className='text-white/80 text-sm font-medium'>Select Role</label>
            <div className='grid grid-cols-2 gap-3'>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'USER'})}
                className={`px-4 py-3 rounded-xl border-2 transition-all ${
                  formData.role === 'USER'
                    ? 'border-[#8f88ff] bg-[#8f88ff]/20 text-white'
                    : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                }`}
              >
                <div className='text-sm font-semibold'>User</div>
                <div className='text-xs mt-1 opacity-70'>Regular account</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'SELLER'})}
                className={`px-4 py-3 rounded-xl border-2 transition-all ${
                  formData.role === 'SELLER'
                    ? 'border-[#8f88ff] bg-[#8f88ff]/20 text-white'
                    : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                }`}
              >
                <div className='text-sm font-semibold'>Seller</div>
                <div className='text-xs mt-1 opacity-70'>Business account</div>
              </button>
            </div>
            {formData.role === 'SELLER' && (
              <p className='text-[#8f88ff] text-xs mt-1 flex items-center gap-1'>
                <span>ℹ️</span>
                <span>Seller accounts require admin approval after signup</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className='btn-primary mt-2'
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className='text-center text-white/70 text-sm'>
          Already have an account?{' '}
          <Link to="/login" className='text-[#8f88ff] hover:text-[#a59fff] font-medium transition-colors'>
            Sign in
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

export default Signup

