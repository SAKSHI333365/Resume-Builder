import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "./auth.form.scss"

const Register = () => {
    const { loading, error, handleRegister } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [submitError, setSubmitError] = useState("")

    const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError("")
    try {
      await handleRegister({ username, email, password })
      navigate("/")
    } catch (err) {
      setSubmitError(err.response?.data?.message || (err.request
        ? "Can't reach the API. Make sure the backend is running, then try again."
        : "Unable to create your account. Please try again."))
    }
  }

  return (
     <main className="auth-page">
      <section className="form-container">
        <span className="eyebrow">RESUME STUDIO</span>
        <h1>Create your account</h1>
        <p className="form-intro">Set up your workspace and get interview-ready.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Name</label>
            <input required autoComplete="name" value={username} onChange={(e) => setUsername(e.target.value)}
              type="text" id="username" name="username" placeholder="Your name" />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
              type="email" id="email" name="email" placeholder="you@example.com" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input required minLength={6} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}
              type="password" id="password" name="password" placeholder="At least 6 characters" />
          </div>
          {(error || submitError) && <p className="form-error" role="alert">{submitError || error}</p>}
          <button className="button primary-button" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="form-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  )
}

export default Register
