import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { loginUser } from "../store/authSlice";

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        emailId: "",
        password: "",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.emailId || !formData.password) {
            toast.error("Please fill all fields");
            return;
        }

        const result = await dispatch(loginUser(formData));

        if (loginUser.fulfilled.match(result)) {

            toast.success("Login Successful");

        } else {

            toast.error(result.payload || "Invalid Credentials");

        }

    };

    useEffect(() => {

        if (isAuthenticated) {
            navigate("/");
        }

    }, [isAuthenticated, navigate]);

    return (

        <div className="min-h-screen flex items-center justify-center bg-base-200">

            <div className="card w-96 bg-base-100 shadow-xl">

                <div className="card-body">

                    <h2 className="text-3xl font-bold text-center">
                        Login
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 mt-4"
                    >

                        <input
                            type="email"
                            name="emailId"
                            placeholder="Email"
                            className="input input-bordered w-full"
                            value={formData.emailId}
                            onChange={handleChange}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="input input-bordered w-full"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? "Logging In..." : "Login"}
                        </button>

                    </form>

                    {error && (
                        <p className="text-center text-red-500 mt-2">
                            {error}
                        </p>
                    )}

                    <p className="text-center mt-4">

                        Don't have an account?

                        <Link
                            to="/register"
                            className="text-primary ml-2"
                        >
                            Register
                        </Link>

                    </p>

                </div>

            </div>

        </div>

    );

}

export default Login;