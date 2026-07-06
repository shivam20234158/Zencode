import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import { FaAward, FaFire, FaCheckCircle, FaChevronRight } from "react-icons/fa";
import Loader from "./Loader";

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [solvedRes, allRes] = await Promise.all([
                axiosClient.get("/submissions/solved"),
                axiosClient.get("/problems"),
            ]);

            const solvedProblems = solvedRes.data || [];
            const allProblems = allRes.data.problems || [];

            // Calculate difficulty counts
            const totalCount = allProblems.length;
            const easyCount = allProblems.filter((p) => p.difficulty === "Easy").length;
            const mediumCount = allProblems.filter((p) => p.difficulty === "Medium").length;
            const hardCount = allProblems.filter((p) => p.difficulty === "Hard").length;

            const solvedTotal = solvedProblems.length;
            const solvedEasy = solvedProblems.filter((p) => p.difficulty === "Easy").length;
            const solvedMedium = solvedProblems.filter((p) => p.difficulty === "Medium").length;
            const solvedHard = solvedProblems.filter((p) => p.difficulty === "Hard").length;

            setStats({
                total: totalCount,
                easy: easyCount,
                medium: mediumCount,
                hard: hardCount,
                solved: solvedTotal,
                solvedEasy,
                solvedMedium,
                solvedHard,
                recentSolved: solvedProblems.slice(-5).reverse(), // Last 5 solved problems
            });
        } catch (err) {
            console.error("Failed to load dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (!stats) {
        return (
            <div className="text-center p-6 text-error">
                Failed to load stats. Please refresh the page.
            </div>
        );
    }

    const overallPercentage = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
    const easyPercentage = stats.easy > 0 ? Math.round((stats.solvedEasy / stats.easy) * 100) : 0;
    const mediumPercentage = stats.medium > 0 ? Math.round((stats.solvedMedium / stats.medium) * 100) : 0;
    const hardPercentage = stats.hard > 0 ? Math.round((stats.solvedHard / stats.hard) * 100) : 0;

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaAward className="text-primary" />
                <span>Coding Statistics</span>
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Overall Circular Stats */}
                <div className="card bg-base-100 border border-base-300 shadow-sm p-6 flex flex-col items-center justify-center text-center">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                        {/* Background Ring */}
                        <svg className="absolute w-full h-full transform -rotate-90">
                            <circle
                                cx="72"
                                cy="72"
                                r="64"
                                className="stroke-base-200 fill-none"
                                strokeWidth="12"
                            />
                            {/* Accent Ring */}
                            <circle
                                cx="72"
                                cy="72"
                                r="64"
                                className="stroke-primary fill-none transition-all duration-1000 ease-out"
                                strokeWidth="12"
                                strokeDasharray={2 * Math.PI * 64}
                                strokeDashoffset={2 * Math.PI * 64 * (1 - overallPercentage / 100)}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div>
                            <div className="text-3xl font-extrabold text-base-content">{stats.solved}</div>
                            <div className="text-xs text-base-content/60 font-semibold mt-0.5">Solved / {stats.total}</div>
                        </div>
                    </div>
                    <div className="mt-4 font-bold text-sm text-primary">{overallPercentage}% Completion Rate</div>
                </div>

                {/* Difficulty Categorized Progress Bars */}
                <div className="card bg-base-100 border border-base-300 shadow-sm p-6 col-span-2 space-y-5 justify-center">
                    {/* Easy Category */}
                    <div>
                        <div className="flex justify-between text-sm font-semibold mb-1">
                            <span className="text-success">Easy</span>
                            <span className="text-base-content/75">{stats.solvedEasy} / {stats.easy}</span>
                        </div>
                        <div className="w-full bg-base-200 h-3.5 rounded-full overflow-hidden border border-base-300">
                            <div
                                className="bg-success h-full transition-all duration-1000 ease-out rounded-full"
                                style={{ width: `${easyPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Medium Category */}
                    <div>
                        <div className="flex justify-between text-sm font-semibold mb-1">
                            <span className="text-warning">Medium</span>
                            <span className="text-base-content/75">{stats.solvedMedium} / {stats.medium}</span>
                        </div>
                        <div className="w-full bg-base-200 h-3.5 rounded-full overflow-hidden border border-base-300">
                            <div
                                className="bg-warning h-full transition-all duration-1000 ease-out rounded-full"
                                style={{ width: `${mediumPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Hard Category */}
                    <div>
                        <div className="flex justify-between text-sm font-semibold mb-1">
                            <span className="text-error">Hard</span>
                            <span className="text-base-content/75">{stats.solvedHard} / {stats.hard}</span>
                        </div>
                        <div className="w-full bg-base-200 h-3.5 rounded-full overflow-hidden border border-base-300">
                            <div
                                className="bg-error h-full transition-all duration-1000 ease-out rounded-full"
                                style={{ width: `${hardPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recently Solved */}
            <div className="card bg-base-100 border border-base-300 shadow-sm p-6">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-1.5 border-b pb-2">
                    <FaFire className="text-orange-500" />
                    <span>Recently Solved Problems</span>
                </h4>

                {stats.recentSolved.length === 0 ? (
                    <div className="text-center py-6 text-sm text-base-content/50">
                        You haven't solved any problems yet. Go check out the problems list!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {stats.recentSolved.map((problem) => (
                            <div
                                key={problem._id}
                                className="flex items-center justify-between p-3 bg-base-200/50 hover:bg-base-200 rounded-xl transition-all border border-base-300/40"
                            >
                                <div className="flex items-center gap-3">
                                    <FaCheckCircle className="text-success text-lg flex-shrink-0" />
                                    <div>
                                        <div className="font-semibold text-sm">{problem.title}</div>
                                        <div className="flex gap-1.5 mt-0.5">
                                            <span className={`text-[10px] font-bold uppercase ${
                                                problem.difficulty === "Easy" ? "text-success" : problem.difficulty === "Medium" ? "text-warning" : "text-error"
                                            }`}>
                                                {problem.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    to={`/problems/${problem._id}`}
                                    className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content"
                                >
                                    <FaChevronRight className="text-xs" />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
