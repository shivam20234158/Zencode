import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaRobot, FaUser, FaSpinner } from "react-icons/fa";
import axiosClient from "../utils/axiosClient";
import toast from "react-hot-toast";

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([
        {
            role: "model",
            parts: [{ text: "Hello! I am your AI DSA Tutor. Need a hint, a bug explanation, or want to discuss optimal complexities? Ask me anything about this problem!" }]
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading || !problem) return;

        const userMsg = {
            role: "user",
            parts: [{ text: input }]
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const { data } = await axiosClient.post("/ai/chat", {
                messages: updatedMessages,
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    parts: [{ text: data.message }]
                }
            ]);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "AI Tutor failed to respond.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to format text (handles simple code blocks `like this` and multi-line code)
    const formatMessageText = (text) => {
        if (!text) return "";
        
        // Simple parser for block code ```cpp ... ```
        const parts = text.split(/(```[\s\S]*?```)/g);
        
        return parts.map((part, index) => {
            if (part.startsWith("```")) {
                const lines = part.split("\n");
                // Remove the markdown symbols
                const codeLines = lines.slice(1, lines.length - 1).join("\n");
                const lang = lines[0].replace("```", "").trim();
                return (
                    <div key={index} className="my-3 rounded-lg overflow-hidden border border-base-300">
                        {lang && (
                            <div className="bg-neutral text-neutral-content text-xs px-3 py-1 font-sans flex justify-between select-none">
                                <span>{lang.toUpperCase()}</span>
                                <span className="opacity-50">AI Generated</span>
                            </div>
                        )}
                        <pre className="bg-neutral text-neutral-content p-4 text-xs font-mono overflow-x-auto whitespace-pre">
                            <code>{codeLines}</code>
                        </pre>
                    </div>
                );
            }
            
            // Inline code `like this`
            const subParts = part.split(/(`[^`\n]+`)/g);
            return (
                <span key={index} className="whitespace-pre-wrap wrap-break-words">
                    {subParts.map((subPart, subIndex) => {
                        if (subPart.startsWith("`") && subPart.endsWith("`")) {
                            return (
                                <code key={subIndex} className="bg-base-300 px-1.5 py-0.5 rounded text-primary font-mono text-sm font-semibold mx-0.5">
                                    {subPart.slice(1, -1)}
                                </code>
                            );
                        }
                        return subPart;
                    })}
                </span>
            );
        });
    };

    return (
        <div className="flex flex-col h-full bg-base-100 border-l border-base-200">
            {/* Chat Messages */}
            <div className="grow overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-230px)]">
                {messages.map((msg, index) => {
                    const isAi = msg.role === "model";
                    return (
                        <div key={index} className={`chat ${isAi ? "chat-start" : "chat-end"}`}>
                            <div className="chat-image avatar">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                    isAi ? "bg-primary text-primary-content" : "bg-neutral text-neutral-content"
                                }`}>
                                    {isAi ? <FaRobot /> : <FaUser />}
                                </div>
                            </div>
                            <div className={`chat-bubble max-w-xl text-sm leading-relaxed ${
                                isAi ? "bg-base-200 text-base-content" : "bg-primary text-primary-content"
                            }`}>
                                {formatMessageText(msg.parts[0]?.text)}
                            </div>
                        </div>
                    );
                })}
                {loading && (
                    <div className="chat chat-start">
                        <div className="chat-image avatar">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-content">
                                <FaRobot />
                            </div>
                        </div>
                        <div className="chat-bubble bg-base-200 text-base-content flex items-center gap-2 py-3 px-4">
                            <FaSpinner className="animate-spin" />
                            <span className="text-xs font-semibold opacity-70">AI Tutor is thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-base-200 border-t border-base-300 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask for hints or explain your code..."
                    className="input input-bordered flex-1 focus:outline-none focus:border-primary text-sm h-10"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="btn btn-primary h-10 min-h-0 px-4"
                    disabled={loading || !input.trim()}
                >
                    <FaPaperPlane className="text-xs" />
                </button>
            </form>
        </div>
    );
}

export default ChatAi;