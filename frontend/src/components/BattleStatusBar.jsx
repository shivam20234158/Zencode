import { useState, useEffect } from "react";
import { FaCopy, FaCheck, FaClock, FaBolt, FaFlag } from "react-icons/fa";
import toast from "react-hot-toast";

function BattleStatusBar({
    battle,
    currentUser,
    opponentProgress,
    onSurrender,
}) {
    const [copied, setCopied] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);

    // Calculate remaining seconds to deadline
    useEffect(() => {
        if (!battle?.deadline) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const end = new Date(battle.deadline).getTime();
            const diff = Math.max(0, Math.floor((end - now) / 1000));
            setSecondsLeft(diff);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [battle?.deadline]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const copyRoomCode = () => {
        if (!battle?.roomCode) return;
        navigator.clipboard.writeText(battle.roomCode);
        setCopied(true);
        toast.success("Room code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const players = battle?.players || [];
    const myPlayer = players.find(
        (p) => p.user?._id?.toString() === currentUser?._id?.toString()
    );
    const opponent = players.find(
        (p) => p.user?._id?.toString() !== currentUser?._id?.toString()
    );

    const opponentStatus = opponentProgress?.status || opponent?.status || "coding";
    const opponentPassed = opponentProgress?.testCasesPassed ?? 0;
    const opponentTotal = opponentProgress?.testCasesTotal ?? battle?.problem?.hiddenTestCases?.length ?? 0;

    const getStatusBadge = (status) => {
        switch (status) {
            case "accepted":
                return <span className="badge badge-success font-semibold">Accepted 🎉</span>;
            case "submitted":
                return <span className="badge badge-warning font-semibold">Submitted ⏳</span>;
            case "failed":
                return <span className="badge badge-error font-semibold">Wrong Answer ❌</span>;
            default:
                return <span className="badge badge-ghost font-semibold">Coding 💻</span>;
        }
    };

    const isUrgent = secondsLeft < 60 && secondsLeft > 0;

    return (
        <div className="bg-base-100 border-b border-base-300 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            {/* Left: Current User */}
            <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-9 h-9 text-sm font-bold flex items-center justify-center">
                        {currentUser?.firstName?.slice(0, 2) || "ME"}
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">
                            {currentUser?.firstName} (You)
                        </span>
                        {getStatusBadge(myPlayer?.status || "coding")}
                    </div>
                    <span className="text-xs text-base-content/60">
                        Submissions: {myPlayer?.submissionCount || 0}
                    </span>
                </div>
            </div>

            {/* Center: Timer & Room Info */}
            <div className="flex items-center gap-4">
                <div
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-base font-bold shadow-inner ${
                        isUrgent
                            ? "bg-error/20 text-error animate-pulse"
                            : "bg-base-200 text-base-content"
                    }`}
                >
                    <FaClock />
                    <span>{formatTime(secondsLeft)}</span>
                </div>

                <button
                    onClick={copyRoomCode}
                    className="btn btn-xs btn-outline gap-1 font-mono"
                    title="Click to copy room code"
                >
                    {copied ? <FaCheck className="text-success" /> : <FaCopy />}
                    <span>{battle?.roomCode}</span>
                </button>

                <span className="badge badge-outline badge-sm capitalize">
                    {battle?.difficulty}
                </span>
            </div>

            {/* Right: Opponent Progress & Surrender */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 text-right">
                    <div>
                        <div className="flex items-center gap-2 justify-end">
                            {getStatusBadge(opponentStatus)}
                            <span className="font-bold text-sm">
                                {opponent?.user?.name || "Opponent"}
                            </span>
                        </div>
                        {opponentTotal > 0 && (
                            <span className="text-xs text-base-content/60">
                                Passed: {opponentPassed} / {opponentTotal} tests
                            </span>
                        )}
                    </div>
                    <div className="avatar placeholder">
                        <div className="bg-secondary text-secondary-content rounded-full w-9 h-9 text-sm font-bold flex items-center justify-center">
                            {opponent?.user?.name?.slice(0, 2)?.toUpperCase() || "VS"}
                        </div>
                    </div>
                </div>

                {onSurrender && (
                    <button
                        onClick={onSurrender}
                        className="btn btn-ghost btn-xs btn-outline btn-error gap-1"
                        title="Leave or surrender battle"
                    >
                        <FaFlag />
                        <span>Leave</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default BattleStatusBar;
