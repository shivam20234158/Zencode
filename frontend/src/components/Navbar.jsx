import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";
import toast from "react-hot-toast";

function Navbar() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

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

        <div className="navbar bg-base-100 shadow-md px-8">

            <div className="flex-1">

                <Link
                    to="/"
                    className="text-2xl font-bold text-primary"
                >
                    ZenCode
                </Link>

            </div>

            <div className="flex gap-3">

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

                {isAuthenticated ? (

                    <>

                        <Link
                            to="/profile"
                            className="btn btn-ghost"
                        >
                            {user?.firstName}
                        </Link>

                        <button
                            className="btn btn-error"
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