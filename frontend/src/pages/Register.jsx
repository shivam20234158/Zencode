import { Link } from "react-router-dom";

function Register() {

    return (

        <div className="min-h-screen flex items-center justify-center bg-base-200">

            <div className="card w-105 bg-base-100 shadow-xl">

                <div className="card-body">

                    <h2 className="text-3xl font-bold text-center">
                        Register
                    </h2>

                    <form className="space-y-4 mt-4">

                        <input
                            type="text"
                            placeholder="First Name"
                            className="input input-bordered w-full"
                        />

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
                            Register
                        </button>

                    </form>

                    <p className="text-center mt-4">

                        Already have an account?

                        <Link
                            to="/login"
                            className="text-primary ml-2"
                        >
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>

    );

}

export default Register;