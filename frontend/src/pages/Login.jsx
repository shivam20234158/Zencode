import { Link } from "react-router-dom";

function Login() {

    return (

        <div className="min-h-screen flex items-center justify-center bg-base-200">

            <div className="card w-96 bg-base-100 shadow-xl">

                <div className="card-body">

                    <h2 className="text-3xl font-bold text-center">
                        Login
                    </h2>

                    <form className="space-y-4 mt-4">

                        <input
                            type="email"
                            placeholder="Email"
                            className="input input-bordered w-full"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="input input-bordered w-full"
                        />

                        <button
                            className="btn btn-primary w-full"
                        >
                            Login
                        </button>

                    </form>

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