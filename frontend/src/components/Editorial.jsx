import { FaVideoSlash, FaPlay } from "react-icons/fa";

function Editorial({ problem }) {
    if (!problem) {
        return (
            <div className="flex justify-center items-center h-full bg-base-100 p-6">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }

    const hasVideo = !!problem.secureUrl;

    return (
        <div className="flex flex-col h-full bg-base-100 p-6 overflow-y-auto max-h-[calc(100vh-230px)]">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaPlay className="text-primary text-lg" />
                <span>Video Editorial</span>
            </h2>

            {hasVideo ? (
                <div className="space-y-4">
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-base-300 bg-black">
                        <video
                            src={problem.secureUrl}
                            poster={problem.thumbnailUrl}
                            controls
                            className="w-full h-full object-contain"
                            controlsList="nodownload"
                        />
                    </div>
                    
                    <div className="stats bg-base-200 w-full shadow border border-base-300">
                        <div className="stat py-3">
                            <div className="stat-title text-xs">Video Duration</div>
                            <div className="stat-value text-lg">
                                {problem.duration ? `${Math.round(problem.duration)} seconds` : "N/A"}
                            </div>
                        </div>
                        <div className="stat py-3">
                            <div className="stat-title text-xs">Problem Difficulty</div>
                            <div className={`stat-value text-lg font-bold ${
                                problem.difficulty === "Easy" ? "text-success" : problem.difficulty === "Medium" ? "text-warning" : "text-error"
                            }`}>
                                {problem.difficulty}
                            </div>
                        </div>
                    </div>

                    <div className="alert bg-base-200 border-base-300 text-sm">
                        <span>
                            Need help understanding specific concepts in this editorial? Head over to the <strong>AI Tutor</strong> tab to ask detailed doubts!
                        </span>
                    </div>
                </div>
            ) : (
                <div className="grow flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-base-300 rounded-2xl bg-base-200/50">
                    <FaVideoSlash className="text-6xl text-base-content/30 mb-4 animate-pulse" />
                    <h3 className="text-lg font-bold mb-1">No video editorial available</h3>
                    <p className="text-sm text-base-content/65 max-w-sm">
                        An editorial video has not been uploaded for this problem yet. You can still solve it and request help from our AI Tutor!
                    </p>
                </div>
            )}
        </div>
    );
}

export default Editorial;