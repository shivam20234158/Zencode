import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTrophy, FaTimesCircle, FaMinusCircle, FaGamepad, FaClock, FaRedo, FaCode } from "react-icons/fa";
import axiosClient from "../utils/axiosClient";
import Loader from "../components/Loader";

function BattleResult() {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((state) => state.auth);

    const [battle, setBattle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const { data } = await axiosClient.get(`/battles/${roomCode}`);
                setBattle(data);
            } catch (err) {
                console.error("Failed to fetch result:", err.message);
                navigate("/battle");
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [roomCode, navigate]);

    if (loading) return <Loader />;
    if (!battle) return null;

    const isWinner = battle.winner?._id?.toString() === currentUser?._id?.toString() || battle.winner?.toString() === currentUser?._id?.toString();
    const isDraw = battle.isDraw;

    const getElapsedMinutes = () => {
        if (!battle.startedAt || !battle.endedAt) return "N/A";
        const diffMs = new Date(battle.endedAt).getTime() - new Date(battle.startedAt).getTime();
        const mins = Math.floor(diffMs / 60000);
        const secs = Math.floor((diffMs % 60000) / 1000);
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card w-full max-w-xl bg-base-100 shadow-2xl border border-base-300 animate-fade-in">
                <div className="card-body text-center items-center py-10">
                    {/* Result Icon & Heading */}
                    {isDraw ? (
                        <div className="space-y-2">
                            <div className="w-20 h-20 rounded-full bg-warning/15 text-warning mx-auto flex items-center justify-center text-4xl shadow-inner">
                                <FaMinusCircle />
                            </div>
                            <h1 className="text-3xl font-black text-warning">Battle Drawn!</h1>
                            <p className="text-sm text-base-content/70">
                                Neither player submitted an accepted solution before time expired.
                            </p>
                        </div>
                    ) : isWinner ? (
                        <div className="space-y-2">
                            <div className="w-20 h-20 rounded-full bg-success/15 text-success mx-auto flex items-center justify-center text-4xl shadow-inner animate-bounce">
                                <FaTrophy />
                            </div>
                            <h1 className="text-4xl font-black text-success">Victory! 🏆</h1>
                            <p className="text-sm text-base-content/70">
                                Congratulations! You solved the problem first and won the battle.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="w-20 h-20 rounded-full bg-error/15 text-error mx-auto flex items-center justify-center text-4xl shadow-inner">
                                <FaTimesCircle />
                            </div>
                            <h1 className="text-3xl font-black text-error">Defeat</h1>
                            <p className="text-sm text-base-content/70">
                                Your opponent passed all test cases first. Good effort!
                            </p>
                        </div>
                    )}

                    {/* Problem & Time Summary */}
                    <div className="w-full bg-base-200/60 rounded-xl p-4 my-6 space-y-3 border border-base-300">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-base-content/60">Problem</span>
                            <span className="font-bold">{battle.problem?.title}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-base-content/60">Difficulty</span>
                            <span
                                className={`badge badge-sm ${
                                    battle.difficulty === "Easy"
                                        ? "badge-success"
                                        : battle.difficulty === "Medium"
                                        ? "badge-warning"
                                        : "badge-error"
                                }`}
                            >
                                {battle.difficulty}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-base-content/60">Battle Duration</span>
                            <span className="font-mono font-bold flex items-center gap-1">
                                <FaClock className="text-xs text-base-content/50" />
                                {getElapsedMinutes()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-base-content/60">Room Code</span>
                            <span className="font-mono font-bold uppercase">{battle.roomCode}</span>
                        </div>
                    </div>

                    {/* Players Overview */}
                    <div className="w-full grid grid-cols-2 gap-3 mb-6">
                        {battle.players?.map((p, idx) => {
                            const isThisUser = p.user?._id?.toString() === currentUser?._id?.toString();
                            const won = battle.winner?._id?.toString() === p.user?._id?.toString();

                            return (
                                <div
                                    key={idx}
                                    className={`p-3 rounded-xl border text-left flex flex-col justify-between ${
                                        won
                                            ? "border-success bg-success/10"
                                            : "border-base-300 bg-base-200/40"
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-sm truncate">
                                                {p.user?.name} {isThisUser && "(You)"}
                                            </span>
                                            {won && <span className="badge badge-success badge-xs">Winner</span>}
                                        </div>
                                        <div className="text-xs text-base-content/60 mt-1 capitalize">
                                            Status: {p.status}
                                        </div>
                                    </div>
                                    <div className="text-xs text-base-content/60 mt-2">
                                        Submissions: {p.submissionCount || 0}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={() => navigate("/battle")}
                            className="btn btn-primary flex-1 gap-2"
                        >
                            <FaGamepad />
                            <span>Play Another Battle</span>
                        </button>

                        {battle.problem?._id && (
                            <Link
                                to={`/problems/${battle.problem._id}`}
                                className="btn btn-outline flex-1 gap-2"
                            >
                                <FaCode />
                                <span>Practice Problem</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BattleResult;
