import { useState, useEffect } from "react";
import { FaTerminal, FaCheckCircle, FaTimesCircle, FaPlay, FaExclamationTriangle } from "react-icons/fa";

function OutputConsole({ runResult, submitResult, problem }) {
    const [activeTab, setActiveTab] = useState("testcase");
    const [activeCaseIndex, setActiveCaseIndex] = useState(0);

    // Automatically switch to "Result" tab when a run or submit completes
    useEffect(() => {
        if (runResult || submitResult) {
            setActiveTab("result");
            setActiveCaseIndex(0);
        }
    }, [runResult, submitResult]);

    if (!problem) {
        return (
            <div className="p-4 bg-base-300 h-full flex items-center justify-center">
                <span className="text-gray-500">Loading problem context...</span>
            </div>
        );
    }

    const testCases = problem.visibleTestCases || [];

    return (
        <div className="h-full bg-base-300 flex flex-col border-t border-base-200">
            {/* Header Tabs */}
            <div className="flex justify-between items-center bg-base-200 px-4 border-b border-base-100">
                <div className="tabs tabs-boxed bg-transparent gap-1 py-1.5">
                    <button
                        className={`tab tab-sm font-semibold rounded-md ${
                            activeTab === "testcase" ? "tab-active bg-primary text-primary-content" : "text-base-content/70 hover:bg-base-300"
                        }`}
                        onClick={() => setActiveTab("testcase")}
                    >
                        <FaTerminal className="mr-1.5 text-xs" />
                        Testcase
                    </button>
                    <button
                        className={`tab tab-sm font-semibold rounded-md ${
                            activeTab === "result" ? "tab-active bg-primary text-primary-content" : "text-base-content/70 hover:bg-base-300"
                        }`}
                        onClick={() => setActiveTab("result")}
                    >
                        Result
                        {(runResult || submitResult) && (
                            <span className={`ml-1.5 w-2 h-2 rounded-full ${
                                (runResult?.success || submitResult?.accepted) ? "bg-success" : "bg-error"
                            }`}></span>
                        )}
                    </button>
                </div>

                <div className="text-xs text-base-content/50 select-none">
                    Console Output
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 text-sm font-mono">
                {activeTab === "testcase" && (
                    <div className="space-y-4 h-full flex flex-col">
                        {/* Test Case Selectors */}
                        <div className="flex gap-2">
                            {testCases.map((_, index) => (
                                <button
                                    key={index}
                                    className={`btn btn-xs ${
                                        activeCaseIndex === index ? "btn-neutral" : "btn-ghost bg-base-200"
                                    }`}
                                    onClick={() => setActiveCaseIndex(index)}
                                >
                                    Case {index + 1}
                                </button>
                            ))}
                        </div>

                        {/* Testcase Inputs and Outputs */}
                        {testCases[activeCaseIndex] ? (
                            <div className="space-y-3 flex-1 overflow-y-auto">
                                <div>
                                    <div className="text-xs text-base-content/60 mb-1">Input:</div>
                                    <pre className="bg-base-100 p-2.5 rounded-lg border border-base-200 whitespace-pre-wrap break-all">
                                        {testCases[activeCaseIndex].input || "No Input"}
                                    </pre>
                                </div>
                                <div>
                                    <div className="text-xs text-base-content/60 mb-1">Expected Output:</div>
                                    <pre className="bg-base-100 p-2.5 rounded-lg border border-base-200 whitespace-pre-wrap break-all">
                                        {testCases[activeCaseIndex].output || "No Output"}
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center flex-1 text-base-content/40">
                                No test cases defined for this problem.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "result" && (
                    <div className="space-y-4 h-full flex flex-col">
                        {/* If Run Code Result exists */}
                        {runResult && (
                            <div className="space-y-3 flex-1 flex flex-col overflow-y-auto">
                                {/* Verdict banner */}
                                <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                                    runResult.success 
                                        ? "bg-success/15 border-success text-success-content" 
                                        : "bg-error/15 border-error text-error-content"
                                }`}>
                                    {runResult.success ? (
                                        <FaCheckCircle className="text-2xl text-success" />
                                    ) : (
                                        <FaTimesCircle className="text-2xl text-error" />
                                    )}
                                    <div>
                                        <div className="font-bold text-base">
                                            {runResult.success ? "Accepted" : runResult.errorMessage?.includes("Compilation") ? "Compile Error" : "Wrong Answer"}
                                        </div>
                                        <div className="text-xs opacity-80">
                                            {runResult.testCasesPassed} / {runResult.totalTestCases} Testcases Passed | Time: {runResult.runtime.toFixed(3)}s | Memory: {runResult.memory} KB
                                        </div>
                                    </div>
                                </div>

                                {/* Stderr/Compilation error if present */}
                                {runResult.errorMessage && (
                                    <div className="bg-neutral text-neutral-content p-3 rounded-lg border border-base-100 max-h-48 overflow-y-auto">
                                        <div className="text-xs font-bold text-error flex items-center gap-1.5 mb-1">
                                            <FaExclamationTriangle />
                                            Diagnostics:
                                        </div>
                                        <pre className="text-xs whitespace-pre-wrap break-all">
                                            {runResult.errorMessage}
                                        </pre>
                                    </div>
                                )}

                                {/* Per-testcase results */}
                                {runResult.testResults && runResult.testResults.length > 0 && (
                                    <div className="space-y-3 flex-1">
                                        <div className="flex gap-2">
                                            {runResult.testResults.map((test, index) => {
                                                const passed = (test.status_id ?? test.status?.id) === 3;
                                                return (
                                                    <button
                                                        key={index}
                                                        className={`btn btn-xs ${
                                                            activeCaseIndex === index 
                                                                ? passed ? "btn-success text-success-content" : "btn-error text-error-content"
                                                                : passed ? "btn-outline btn-success" : "btn-outline btn-error"
                                                        }`}
                                                        onClick={() => setActiveCaseIndex(index)}
                                                    >
                                                        Case {index + 1} ({passed ? "Pass" : "Fail"})
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {testCases[activeCaseIndex] && runResult.testResults[activeCaseIndex] ? (
                                            <div className="space-y-2.5 overflow-y-auto">
                                                <div>
                                                    <div className="text-xs text-base-content/60">Input:</div>
                                                    <pre className="bg-base-100 p-2 rounded border border-base-200">
                                                        {testCases[activeCaseIndex].input}
                                                    </pre>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <div className="text-xs text-base-content/60">Expected:</div>
                                                        <pre className="bg-base-100 p-2 rounded border border-base-200 text-success-content">
                                                            {testCases[activeCaseIndex].output}
                                                        </pre>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-base-content/60">Your Output:</div>
                                                        <pre className={`bg-base-100 p-2 rounded border ${
                                                            (runResult.testResults[activeCaseIndex].status_id ?? runResult.testResults[activeCaseIndex].status?.id) === 3
                                                                ? "border-success text-success" 
                                                                : "border-error text-error"
                                                        }`}>
                                                            {runResult.testResults[activeCaseIndex].stdout || "No output"}
                                                        </pre>
                                                    </div>
                                                </div>
                                                {runResult.testResults[activeCaseIndex].stderr && (
                                                    <div>
                                                        <div className="text-xs text-error font-bold">Stderr:</div>
                                                        <pre className="bg-neutral text-neutral-content p-2 rounded text-xs whitespace-pre-wrap">
                                                            {runResult.testResults[activeCaseIndex].stderr}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* If Submit Result exists */}
                        {submitResult && (
                            <div className="space-y-3 grow flex flex-col justify-center max-w-md mx-auto py-4">
                                <div className={`text-center p-6 rounded-xl border ${
                                    submitResult.accepted 
                                        ? "bg-success/15 border-success text-success"
                                        : "bg-error/15 border-error text-error"
                                }`}>
                                    {submitResult.accepted ? (
                                        <>
                                            <FaCheckCircle className="text-5xl mx-auto mb-3" />
                                            <h2 className="text-2xl font-bold">Accepted 🎉</h2>
                                            <p className="text-sm mt-1 text-base-content/85">All test cases passed successfully!</p>
                                        </>
                                    ) : (
                                        <>
                                            <FaTimesCircle className="text-5xl mx-auto mb-3" />
                                            <h2 className="text-2xl font-bold">Rejected ❌</h2>
                                            <p className="text-sm mt-1 text-base-content/85">
                                                {submitResult.errorMessage?.includes("Compilation") ? "Compilation Error" : "Failed on some test cases"}
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="stats stats-vertical sm:stats-horizontal shadow bg-base-100 border border-base-200">
                                    <div className="stat place-items-center py-2 px-4">
                                        <div className="stat-title text-xs">Passed</div>
                                        <div className="stat-value text-base">{submitResult.passedTestCases} / {submitResult.totalTestCases}</div>
                                    </div>
                                    <div className="stat place-items-center py-2 px-4">
                                        <div className="stat-title text-xs">Runtime</div>
                                        <div className="stat-value text-base">{submitResult.runtime?.toFixed(3)} s</div>
                                    </div>
                                    <div className="stat place-items-center py-2 px-4">
                                        <div className="stat-title text-xs">Memory</div>
                                        <div className="stat-value text-base">{submitResult.memory} KB</div>
                                    </div>
                                </div>

                                {submitResult.errorMessage && (
                                    <div className="bg-neutral text-neutral-content p-3 rounded-lg border border-base-100 max-h-48 overflow-y-auto">
                                        <div className="text-xs font-bold text-error flex items-center gap-1.5 mb-1">
                                            <FaExclamationTriangle />
                                            Diagnostics:
                                        </div>
                                        <pre className="text-xs whitespace-pre-wrap break-all">
                                            {submitResult.errorMessage}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Fallback if no result exists */}
                        {!runResult && !submitResult && (
                            <div className="flex flex-col items-center justify-center flex-1 py-8 text-base-content/40">
                                <FaPlay className="text-3xl mb-2 opacity-50" />
                                <div>Run or submit your code to see the compiler results.</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OutputConsole;