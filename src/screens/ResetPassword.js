import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar';

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 5) {
      setMessage('Password must be at least 5 characters long')
      setLoading(false)
      return
    }

    const response = await fetch("http://localhost:5000/api/resetpassword", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, password })
    });

    const json = await response.json()
    setLoading(false)

    if (json.success) {
      setMessage('Password has been reset successfully. Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } else {
      setMessage(json.error || 'Failed to reset password. The link may have expired.')
    }
  }

  if (!token) {
    return (
      <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', height: '100vh', backgroundSize: 'cover' }}>
        <div>
          <Navbar />
        </div>
        <div className='container'>
          <div className='w-50 m-auto mt-5 border bg-dark border-danger rounded p-4'>
            <h2 className="text-white mb-4">Invalid Reset Link</h2>
            <p className="text-white">The password reset link is invalid or has expired.</p>
            <button className="btn btn-success" onClick={() => navigate('/forgotpassword')}>
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', height: '100vh', backgroundSize: 'cover' }}>
      <div>
        <Navbar />
      </div>
      <div className='container'>
        <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>
          <div className="m-3">
            <h2 className="text-white mb-4">Reset Password</h2>
            <label htmlFor="password" className="form-label text-white">New Password</label>
            <input type="password" className="form-control" name='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="m-3">
            <label htmlFor="confirmPassword" className="form-label text-white">Confirm New Password</label>
            <input type="password" className="form-control" name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="m-3 btn btn-success" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <button type="button" className="m-3 btn btn-danger" onClick={() => navigate('/login')}>
            Cancel
          </button>
          {message && (
            <div className={`m-3 alert ${message.includes('failed') || message.includes('Failed') || message.includes('expired') ? 'alert-danger' : 'alert-success'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
