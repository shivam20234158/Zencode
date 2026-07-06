import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";

function ProtectedRoute({ adminOnly = false }) {
    const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
