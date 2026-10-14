import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBolt, FaTrophy, FaGamepad, FaPlus, FaSignInAlt, FaHistory, FaCheckCircle, FaTimesCircle, FaMinusCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { useBattleStore } from "../store/battleStore";
import axiosClient from "../utils/axiosClient";

function BattleLobby() {
    const navigate = useNavigate();
    const { createBattle, joinBattle } = useBattleStore();

    const [difficulty, setDifficulty] = useState("Medium");
    const [joinCode, setJoinCode] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    const [stats, setStats] = useState({ won: 0, lost: 0, drawn: 0 });
    const [history, setHistory] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [statsRes, historyRes] = await Promise.all([
                    axiosClient.get("/battles/user/stats"),
                    axiosClient.get("/battles/user/history"),
                ]);
                if (statsRes.data?.stats) setStats(statsRes.data.stats);
                if (historyRes.data) setHistory(historyRes.data);
            } catch (err) {
                console.error("Failed to load battle history/stats:", err.message);
            } finally {
                setLoadingData(false);
            }
        };

        fetchUserData();
    }, []);

    const handleCreate = async () => {
        setIsCreating(true);
        try {
            const battle = await createBattle(difficulty);
            toast.success(`Battle room created! Code: ${battle.roomCode}`);
            navigate(`/battle/waiting/${battle.roomCode}`);
        } catch (err) {
            toast.error(err.message || "Failed to create battle");
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        const code = joinCode.trim().toUpperCase();
        if (code.length !== 6) {
            toast.error("Please enter a valid 6-character room code.");
            return;
        }

        setIsJoining(true);
        try {
            const battle = await joinBattle(code);
            if (battle.status === "active") {
                navigate(`/battle/arena/${battle.roomCode}`);
            } else {
                navigate(`/battle/waiting/${battle.roomCode}`);
            }
        } catch (err) {
            toast.error(err.message || "Failed to join battle");
        } finally {
            setIsJoining(false);
        }
    };

    const totalBattles = stats.won + stats.lost + stats.drawn;
    const winRate = totalBattles > 0 ? Math.round((stats.won / totalBattles) * 100) : 0;

    return (
        <div className="min-h-screen bg-base-200 py-10 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Hero Header */}
                <div className="hero bg-gradient-to-r from-primary/10 via-base-100 to-secondary/10 rounded-2xl border border-base-300 p-8 shadow-sm">
                    <div className="hero-content text-center flex-col">
                        <div className="flex items-center justify-center gap-3 text-4xl font-extrabold text-primary">
                            <FaBolt className="text-warning animate-bounce" />
                            <span>1v1 Real-Time Coding Battle</span>
                        </div>
                        <p className="max-w-xl text-base-content/70 mt-2">
                            Go head-to-head with other developers in a live coding duel. First to pass all test cases or highest accuracy before time runs out wins!
                        </p>
                    </div>
                </div>

                {/* Stats Summary Bar */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="stat bg-base-100 rounded-xl border border-base-300 shadow-sm text-center">
                        <div className="stat-title text-xs uppercase">Battles</div>
                        <div className="stat-value text-2xl font-bold">{totalBattles}</div>
                    </div>
                    <div className="stat bg-base-100 rounded-xl border border-base-300 shadow-sm text-center text-success">
                        <div className="stat-title text-xs uppercase text-success">Won</div>
                        <div className="stat-value text-2xl font-bold">{stats.won}</div>
                    </div>
                    <div className="stat bg-base-100 rounded-xl border border-base-300 shadow-sm text-center text-error">
                        <div className="stat-title text-xs uppercase text-error">Lost</div>
                        <div className="stat-value text-2xl font-bold">{stats.lost}</div>
                    </div>
                    <div className="stat bg-base-100 rounded-xl border border-base-300 shadow-sm text-center text-warning">
                        <div className="stat-title text-xs uppercase text-warning">Drawn</div>
                        <div className="stat-value text-2xl font-bold">{stats.drawn}</div>
                    </div>
                    <div className="stat bg-base-100 rounded-xl border border-base-300 shadow-sm text-center col-span-2 md:col-span-1 text-primary">
                        <div className="stat-title text-xs uppercase text-primary">Win Rate</div>
                        <div className="stat-value text-2xl font-bold">{winRate}%</div>
                    </div>
                </div>

                {/* Create & Join Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Create Room */}
                    <div className="card bg-base-100 border border-base-300 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title text-xl gap-2">
                                <FaPlus className="text-primary" /> Create Battle Room
                            </h2>
                            <p className="text-sm text-base-content/70">
                                Choose difficulty. A random problem and private room code will be generated.
                            </p>

                            <div className="form-control my-4">
                                <label className="label">
                                    <span className="label-text font-bold">Select Difficulty</span>
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { diff: "Easy", time: "15 min", color: "badge-success" },
                                        { diff: "Medium", time: "30 min", color: "badge-warning" },
                                        { diff: "Hard", time: "45 min", color: "badge-error" },
                                    ].map(({ diff, time, color }) => (
                                        <button
                                            key={diff}
                                            type="button"
                                            onClick={() => setDifficulty(diff)}
                                            className={`p-3 rounded-xl border text-center transition-all ${
                                                difficulty === diff
                                                    ? "border-primary bg-primary/10 shadow-sm"
                                                    : "border-base-300 hover:border-base-content/30"
                                            }`}
                                        >
                                            <span className={`badge ${color} badge-sm mb-1`}>{diff}</span>
                                            <div className="text-xs text-base-content/60">{time}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleCreate}
                                disabled={isCreating}
                                className="btn btn-primary w-full gap-2 mt-2"
                            >
                                {isCreating ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <FaGamepad />
                                )}
                                Create & Get Room Code
                            </button>
                        </div>
                    </div>

                    {/* Join Room */}
                    <div className="card bg-base-100 border border-base-300 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title text-xl gap-2">
                                <FaSignInAlt className="text-secondary" /> Join Existing Room
                            </h2>
                            <p className="text-sm text-base-content/70">
                                Enter the 6-character room code shared by your opponent or friend.
                            </p>

                            <form onSubmit={handleJoin} className="mt-4 space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold">Room Code</span>
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                        placeholder="e.g. 7K4X9A"
                                        className="input input-bordered w-full font-mono text-center text-xl tracking-widest font-bold uppercase"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isJoining || joinCode.trim().length !== 6}
                                    className="btn btn-secondary w-full gap-2"
                                >
                                    {isJoining ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <FaSignInAlt />
                                    )}
                                    Enter Arena
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Recent Battles List */}
                <div className="card bg-base-100 border border-base-300 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title text-xl gap-2">
                            <FaHistory className="text-primary" /> Battle History
                        </h2>

                        {loadingData ? (
                            <div className="flex justify-center py-8">
                                <span className="loading loading-spinner loading-md"></span>
                            </div>
                        ) : history.length === 0 ? (
                            <p className="text-sm text-base-content/60 py-6 text-center">
                                No battles played yet. Create or join a room above to start competing!
                            </p>
                        ) : (
                            <div className="overflow-x-auto mt-2">
                                <table className="table table-zebra w-full text-sm">
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Problem</th>
                                            <th>Difficulty</th>
                                            <th>Result</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((b) => (
                                            <tr key={b._id}>
                                                <td>
                                                    <span className="badge badge-sm badge-outline uppercase font-mono">
                                                        {b.roomCode}
                                                    </span>
                                                </td>
                                                <td className="font-semibold">{b.problem?.title || "Unknown Problem"}</td>
                                                <td>
                                                    <span
                                                        className={`badge badge-sm ${
                                                            b.difficulty === "Easy"
                                                                ? "badge-success"
                                                                : b.difficulty === "Medium"
                                                                ? "badge-warning"
                                                                : "badge-error"
                                                        }`}
                                                    >
                                                        {b.difficulty}
                                                    </span>
                                                </td>
                                                <td>
                                                    {b.isDraw ? (
                                                        <span className="badge badge-warning gap-1">
                                                            <FaMinusCircle /> Draw
                                                        </span>
                                                    ) : b.winner ? (
                                                        <span className="badge badge-success gap-1">
                                                            <FaCheckCircle /> {b.winner?.name || "Winner"}
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-ghost capitalize">{b.status}</span>
                                                    )}
                                                </td>
                                                <td className="text-xs text-base-content/60">
                                                    {new Date(b.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BattleLobby;
