import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const response = await fetch("http://localhost:5000/api/forgotpassword", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const json = await response.json()
    setLoading(false)

    if (json.success) {
      setMessage('Password reset link has been sent to your email. Please check your inbox.')
    } else {
      setMessage(json.error || 'Failed to send reset link. Please try again.')
    }
  }

  return (
    <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', height: '100vh', backgroundSize: 'cover' }}>
      <div>
        <Navbar />
      </div>
      <div className='container'>
        <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>
          <div className="m-3">
            <h2 className="text-white mb-4">Forgot Password</h2>
            <label htmlFor="email" className="form-label text-white">Enter your email address</label>
            <input type="email" className="form-control" name='email' value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby="emailHelp" required />
            <div id="emailHelp" className="form-text text-white">We'll send you a password reset link.</div>
          </div>
          <button type="submit" className="m-3 btn btn-success" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <button type="button" className="m-3 btn btn-danger" onClick={() => navigate('/login')}>
            Back to Login
          </button>
          {message && (
            <div className={`m-3 alert ${message.includes('failed') || message.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
