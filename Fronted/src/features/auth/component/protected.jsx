import { Navigate } from "react-router"
import { useAuth } from "../hooks/useAuth"

const Protected = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) {
        return <main className="auth-loading"><p>Checking your session...</p></main>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default Protected