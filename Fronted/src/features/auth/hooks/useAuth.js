import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context-value";
import { login, register, logout, getMe } from "../services/auth.api";

const getAuthErrorMessage = (err, fallback) => {
    if (err.response?.data?.message) return err.response.data.message
    if (err.request) return "Can't reach the API. Make sure the backend is running, then try again."
    return fallback
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    const { user, setUser, loading, setLoading, error, setError } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        setError("")
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return data.user
        } catch (err) {
            setError(getAuthErrorMessage(err, "Unable to sign in. Please try again."))
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        setError("")
        try {
            const data = await register(username, email, password)
            setUser(data.user)
            return data.user
        } catch (err) {
            setError(getAuthErrorMessage(err, "Unable to create your account. Please try again."))
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        setError("")
        try {
            await logout()
            setUser(null)
        } catch (err) {
            setError(getAuthErrorMessage(err, "Unable to sign out. Please try again."))
            throw err
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let active = true
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (active) setUser(data.user)
            } catch (err) {
                if (active && err.response?.status !== 401) {
                    setError(getAuthErrorMessage(err, "Unable to verify your session. Please refresh and try again."))
                }
            } finally {
                if (active) setLoading(false)
            }
        }
        getAndSetUser()
        return () => { active = false }
    }, [setLoading, setError, setUser])

    return { user, loading, error, handleRegister, handleLogin, handleLogout }
}