import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import { FaPlay, FaCloudUploadAlt, FaBolt } from "react-icons/fa";
import toast from "react-hot-toast";

import { useBattleStore } from "../store/battleStore";
import { getSocket } from "../utils/socketClient";
import axiosClient from "../utils/axiosClient";

import BattleStatusBar from "../components/BattleStatusBar";
import ProblemDescription from "../components/ProblemDescription";
import OutputConsole from "../components/OutputConsole";
import Loader from "../components/Loader";

const languageMap = {
    cpp: "cpp",
    java: "java",
    python: "python",
    javascript: "javascript",
};

function BattleArena() {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((state) => state.auth);

    const {
        battle,
        opponentProgress,
        setBattle,
        setOpponentProgress,
        submitSolution,
    } = useBattleStore();

    const [loading, setLoading] = useState(!battle);
    const [language, setLanguage] = useState("cpp");
    const [code, setCode] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [runResult, setRunResult] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const pollIntervalRef = useRef(null);

    // Fetch battle data if refreshed or accessed directly
    useEffect(() => {
        const loadBattle = async () => {
            try {
                const { data } = await axiosClient.get(`/battles/${roomCode}`);
                setBattle(data);

                if (data.status === "completed") {
                    navigate(`/battle/result/${roomCode}`);
                    return;
                }
                if (data.status === "waiting") {
                    navigate(`/battle/waiting/${roomCode}`);
                    return;
                }
            } catch (err) {
                toast.error("Failed to load battle arena.");
                navigate("/battle");
            } finally {
                setLoading(false);
            }
        };

        if (!battle || battle.roomCode !== roomCode) {
            loadBattle();
        } else {
            setLoading(false);
        }
    }, [roomCode, battle, navigate, setBattle]);

    // Setup Socket.IO listeners
    useEffect(() => {
        const socket = getSocket();
        socket.emit("join-room", { roomCode });

        const handleOpponentProgress = (data) => {
            if (data.userId?.toString() !== currentUser?._id?.toString()) {
                setOpponentProgress(data);
                if (data.status === "accepted") {
                    toast.success("Opponent accepted the solution!");
                } else if (data.status === "failed") {
                    toast.error(`Opponent passed ${data.testCasesPassed}/${data.testCasesTotal} tests`);
                }
            }
        };

        const handleBattleEnded = ({ battle: finishedBattle }) => {
            setBattle(finishedBattle);
            toast("Battle ended!", { icon: "🏁" });
            navigate(`/battle/result/${roomCode}`);
        };

        const handleBattleCancelled = ({ reason }) => {
            toast.error(reason || "Battle cancelled.");
            navigate("/battle");
        };

        socket.on("opponent-progress", handleOpponentProgress);
        socket.on("battle-ended", handleBattleEnded);
        socket.on("battle-cancelled", handleBattleCancelled);

        return () => {
            socket.off("opponent-progress", handleOpponentProgress);
            socket.off("battle-ended", handleBattleEnded);
            socket.off("battle-cancelled", handleBattleCancelled);
            socket.emit("leave-room", { roomCode });
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, [roomCode, currentUser, navigate, setBattle, setOpponentProgress]);

    // Update starter code when problem or language changes
    useEffect(() => {
        if (!battle?.problem) return;
        const starter = battle.problem.startCode?.find((item) => item.language === language);
        if (starter) {
            setCode(starter.initialCode);
        } else if (!code) {
            setCode("// Write your solution here\n");
        }
    }, [language, battle?.problem]);

    // Run code against visible testcases
    const handleRunCode = async () => {
        if (!battle?.problem?._id) return;
        setIsRunning(true);
        setRunResult(null);

        try {
            const { data } = await axiosClient.post(`/submissions/run/${battle.problem._id}`, {
                code,
                language,
            });
            setRunResult(data);
            if (data.success) {
                toast.success("All sample test cases passed!");
            } else {
                toast.error(data.errorMessage || "Sample tests failed");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Execution error");
        } finally {
            setIsRunning(false);
        }
    };

    // Submit code to battle evaluation queue
    const handleSubmitCode = async () => {
        if (!battle?._id) return;
        setIsSubmitting(true);
        setSubmitResult({ status: "queued", message: "Queued for battle execution..." });

        try {
            const { submissionId } = await submitSolution(battle._id, code, language);

            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

            // Poll submission status until execution finishes
            pollIntervalRef.current = setInterval(async () => {
                try {
                    const { data } = await axiosClient.get(`/submissions/status/${submissionId}`);
                    setSubmitResult(data);

                    if (data.status !== "queued" && data.status !== "processing") {
                        clearInterval(pollIntervalRef.current);
                        setIsSubmitting(false);

                        if (data.accepted) {
                            toast.success("Accepted! Waiting for final battle decision...");
                        } else {
                            toast.error(
                                `Wrong Answer: ${data.passedTestCases || 0}/${data.totalTestCases || 0} passed`
                            );
                        }
                    }
                } catch (pollErr) {
                    clearInterval(pollIntervalRef.current);
                    setIsSubmitting(false);
                }
            }, 1000);
        } catch (err) {
            setIsSubmitting(false);
            toast.error(err.message || "Submission failed");
        }
    };

    const handleSurrender = () => {
        if (window.confirm("Are you sure you want to surrender and leave this battle?")) {
            navigate("/battle");
        }
    };

    if (loading || !battle) {
        return <Loader />;
    }

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col bg-base-100 overflow-hidden">
            {/* Top Battle Status Bar */}
            <BattleStatusBar
                battle={battle}
                currentUser={currentUser}
                opponentProgress={opponentProgress}
                onSurrender={handleSurrender}
            />

            {/* Split Screen Arena */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Problem Details */}
                <div className="w-1/2 border-r border-base-300 overflow-y-auto bg-base-100">
                    <ProblemDescription problem={battle.problem} />
                </div>

                {/* Right: Code Editor & Console */}
                <div className="w-1/2 flex flex-col h-full overflow-hidden">
                    {/* Editor Header / Controls */}
                    <div className="flex justify-between items-center bg-base-200 px-4 py-2 border-b border-base-300">
                        <select
                            className="select select-bordered select-xs w-36 font-semibold"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="cpp">C++ (GCC)</option>
                            <option value="java">Java (OpenJDK)</option>
                            <option value="python">Python 3</option>
                            <option value="javascript">JavaScript</option>
                        </select>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning || isSubmitting}
                                className="btn btn-xs btn-outline gap-1"
                            >
                                {isRunning ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <FaPlay className="text-xs" />
                                )}
                                Run Tests
                            </button>

                            <button
                                onClick={handleSubmitCode}
                                disabled={isRunning || isSubmitting}
                                className="btn btn-xs btn-primary gap-1 font-bold"
                            >
                                {isSubmitting ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <FaBolt className="text-xs text-warning" />
                                )}
                                Submit Solution
                            </button>
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 min-h-[300px]">
                        <Editor
                            height="100%"
                            language={languageMap[language]}
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                wordWrap: "on",
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                            }}
                        />
                    </div>

                    {/* Output Console Panel */}
                    <div className="h-48 border-t border-base-300">
                        <OutputConsole
                            runResult={runResult}
                            submitResult={submitResult}
                            problem={battle.problem}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BattleArena;
