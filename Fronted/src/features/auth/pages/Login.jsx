import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "./auth.form.scss"

const Login = () => {

  const { loading, error, handleLogin } = useAuth()
  const navigate = useNavigate()

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await handleLogin({ email, password })
      navigate('/')
    } catch {
      // The auth hook exposes the request error to this form.
    }
  }

  return (
    <main className="auth-page">
      <section className="form-container">
        <span className="eyebrow">RESUME STUDIO</span>
        <h1>Welcome back</h1>
        <p className="form-intro">Sign in to build a more confident next step.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
              type="email" id="email" name="email" placeholder="you@example.com" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
              type="password" id="password" name="password" placeholder="Enter your password" />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="form-footer">New here? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  )
}

export default Login