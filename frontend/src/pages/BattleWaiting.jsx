import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCopy, FaCheck, FaShareAlt, FaClock, FaGamepad, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { getSocket } from "../utils/socketClient";
import axiosClient from "../utils/axiosClient";

function BattleWaiting() {
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const [copied, setCopied] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(120);
    const [isExpired, setIsExpired] = useState(false);
    const [battle, setBattle] = useState(null);

    useEffect(() => {
        // Fetch current battle state
        const fetchBattle = async () => {
            try {
                const { data } = await axiosClient.get(`/battles/${roomCode}`);
                setBattle(data);
                if (data.status === "active") {
                    navigate(`/battle/arena/${roomCode}`);
                } else if (data.status === "cancelled" || data.status === "completed") {
                    setIsExpired(true);
                } else if (data.waitingDeadline) {
                    const diff = Math.max(
                        0,
                        Math.floor((new Date(data.waitingDeadline).getTime() - Date.now()) / 1000)
                    );
                    setSecondsLeft(diff);
                }
            } catch (err) {
                toast.error("Failed to load battle room.");
                navigate("/battle");
            }
        };

        fetchBattle();

        // Connect socket & listen for opponent joining
        const socket = getSocket();
        socket.emit("join-room", { roomCode });

        const handleBattleStarted = ({ battle }) => {
            toast.success("Opponent joined! Starting battle...");
            navigate(`/battle/arena/${roomCode}`);
        };

        const handleBattleCancelled = ({ reason }) => {
            setIsExpired(true);
            toast.error(reason || "Battle cancelled.");
        };

        socket.on("battle-started", handleBattleStarted);
        socket.on("battle-cancelled", handleBattleCancelled);

        return () => {
            socket.off("battle-started", handleBattleStarted);
            socket.off("battle-cancelled", handleBattleCancelled);
            socket.emit("leave-room", { roomCode });
        };
    }, [roomCode, navigate]);

    // Countdown interval
    useEffect(() => {
        if (isExpired) return;

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    setIsExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isExpired]);

    const copyCode = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        toast.success("Room code copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.origin + `/battle?join=${roomCode}`);
        toast.success("Battle link copied to clipboard!");
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-300">
                <div className="card-body text-center items-center py-10">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl mb-2">
                        <FaGamepad />
                    </div>

                    <h2 className="text-2xl font-black">Battle Room Created</h2>
                    <p className="text-sm text-base-content/70">
                        Share this room code with a friend or opponent to start.
                    </p>

                    {/* Room Code Display */}
                    <div className="my-6 w-full">
                        <div className="bg-base-200 rounded-2xl p-6 border-2 border-dashed border-primary/40 flex flex-col items-center justify-center gap-3">
                            <span className="text-xs uppercase font-bold tracking-widest text-base-content/60">
                                Room Code
                            </span>
                            <span className="text-5xl font-mono font-black tracking-widest text-primary">
                                {roomCode}
                            </span>
                            <div className="flex gap-2 mt-2">
                                <button onClick={copyCode} className="btn btn-sm btn-primary gap-1">
                                    {copied ? <FaCheck /> : <FaCopy />}
                                    <span>{copied ? "Copied" : "Copy Code"}</span>
                                </button>
                                <button onClick={copyLink} className="btn btn-sm btn-outline gap-1">
                                    <FaShareAlt />
                                    <span>Share Link</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Countdown or Expired Alert */}
                    {!isExpired ? (
                        <div className="space-y-4 w-full">
                            <div className="flex items-center justify-center gap-2 text-warning font-mono font-bold text-lg">
                                <FaClock />
                                <span>Room expires in: {formatTime(secondsLeft)}</span>
                            </div>

                            <div className="flex items-center justify-center gap-3 py-2">
                                <span className="loading loading-bars loading-md text-primary"></span>
                                <span className="text-sm font-semibold text-base-content/80 animate-pulse">
                                    Waiting for an opponent to join...
                                </span>
                            </div>

                            <div className="text-xs text-base-content/60">
                                Difficulty: <span className="font-bold">{battle?.difficulty || "Medium"}</span> | Time Limit: <span className="font-bold">{battle?.timeLimitMinutes || 30} mins</span>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-error shadow-sm text-sm">
                            <span>Room expired! No opponent joined within 2 minutes.</span>
                        </div>
                    )}

                    <div className="divider my-4"></div>

                    <button
                        onClick={() => navigate("/battle")}
                        className="btn btn-ghost btn-sm gap-2"
                    >
                        <FaArrowLeft />
                        <span>Back to Battle Lobby</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BattleWaiting;
