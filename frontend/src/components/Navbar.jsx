import { Link } from "react-router-dom";

function Navbar() {
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

            </div>

        </div>
    );
}

export default Navbar;