import { Link } from "react-router-dom";
import { FaCode, FaRobot, FaVideo, FaLaptopCode } from "react-icons/fa";
import { useSelector } from "react-redux";

function Home() {

    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );

    return (

        <div className="min-h-[calc(100vh-64px)] bg-base-200">

            {/* Hero Section */}

            <div className="hero py-20">

                <div className="hero-content text-center">

                    <div className="max-w-3xl">

                        <h1 className="text-6xl font-bold">
                            Master DSA with
                            <span className="text-primary"> ZenCode</span>
                        </h1>

                        <p className="py-6 text-lg text-gray-500">
                            Practice coding problems, execute code instantly,
                            get AI-powered hints, watch editorial videos,
                            and track your progress — all in one platform.
                        </p>

                        <div className="flex justify-center gap-5">

                            <Link
                                to="/problems"
                                className="btn btn-primary btn-lg"
                            >
                                {isAuthenticated
                                    ? "Continue Solving"
                                    : "Start Solving"}
                            </Link>

                            <Link
                                to={isAuthenticated ? "/profile" : "/register"}
                                className="btn btn-outline btn-lg"
                            >
                                {isAuthenticated
                                    ? "My Profile"
                                    : "Get Started"}
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

            {/* Features */}

            <div className="max-w-7xl mx-auto py-10 px-5">

                <h2 className="text-4xl font-bold text-center mb-12">
                    Features
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    <div className="card bg-base-100 shadow-xl">

                        <div className="card-body items-center text-center">

                            <FaLaptopCode className="text-5xl text-primary" />

                            <h2 className="card-title">
                                Code Editor
                            </h2>

                            <p>
                                Solve problems using Monaco Editor with
                                support for multiple programming languages.
                            </p>

                        </div>

                    </div>

                    <div className="card bg-base-100 shadow-xl">

                        <div className="card-body items-center text-center">

                            <FaRobot className="text-5xl text-primary" />

                            <h2 className="card-title">
                                AI Assistant
                            </h2>

                            <p>
                                Ask doubts, receive hints, and understand
                                optimal solutions instantly.
                            </p>

                        </div>

                    </div>

                    <div className="card bg-base-100 shadow-xl">

                        <div className="card-body items-center text-center">

                            <FaVideo className="text-5xl text-primary" />

                            <h2 className="card-title">
                                Editorial Videos
                            </h2>

                            <p>
                                Learn visually with detailed editorial
                                videos for every coding problem.
                            </p>

                        </div>

                    </div>

                    <div className="card bg-base-100 shadow-xl">

                        <div className="card-body items-center text-center">

                            <FaCode className="text-5xl text-primary" />

                            <h2 className="card-title">
                                Judge0 Compiler
                            </h2>

                            <p>
                                Run and submit code instantly using the
                                integrated Judge0 compiler.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Home;