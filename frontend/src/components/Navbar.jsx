import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon, FaCode } from "react-icons/fa";
import toast from "react-hot-toast";

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const { isAuthenticated, user } = useSelector(
        (state) => state.auth
    );

    const handleLogout = async () => {
        const result = await dispatch(logoutUser());
        if (logoutUser.fulfilled.match(result)) {
            toast.success("Logout Successful");
            navigate("/login");
        } else {
            toast.error("Logout Failed");
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-md px-8 sticky top-0 z-50">
            <div className="flex-1">
                <Link
                    to="/"
                    className="text-2xl font-bold text-primary flex items-center gap-2"
                >
                    <FaCode />
                    <span>ZenCode</span>
                </Link>
            </div>

            <div className="flex gap-3 items-center">
                <Link
                    to="/"
                    className="btn btn-ghost"
                >
                    Home
                </Link>

                <Link
                    to="/problems"
                    className="btn btn-ghost"
                >
                    Problems
                </Link>

                {isAuthenticated && user?.role === "admin" && (
                    <Link
                        to="/admin"
                        className="btn btn-ghost text-secondary font-bold"
                    >
                        Admin Panel
                    </Link>
                )}

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="btn btn-ghost btn-circle"
                    title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                    {theme === "dark" ? (
                        <FaSun className="text-yellow-400 text-lg" />
                    ) : (
                        <FaMoon className="text-slate-700 text-lg" />
                    )}
                </button>

                {isAuthenticated ? (
                    <>
                        <Link
                            to="/profile"
                            className="btn btn-ghost border border-base-300"
                        >
                            {user?.firstName}
                        </Link>

                        <button
                            className="btn btn-error btn-outline"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="btn btn-outline btn-primary"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="btn btn-primary"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar;