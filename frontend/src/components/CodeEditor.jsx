import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import axiosClient from "../utils/axiosClient";
import { FaPlay, FaCloudUploadAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const languageMap = {
    cpp: "cpp",
    java: "java",
    python: "python",
    javascript: "javascript",
};

function CodeEditor({

    problem,

    language,

    setLanguage,

    code,

    setCode,

    setRunResult,

    setSubmitResult,

}) {

    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pollIntervalRef = useRef(null);

    useEffect(() => {
        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {

        if (!problem) return;

        const starter = problem.startCode?.find(
            (item) => item.language === language
        );

        if (starter) {

            setCode(starter.initialCode);

        }

    }, [language, problem]);

    async function runCode() {

        if (isRunning || isSubmitting) return;

        try {

            setIsRunning(true);

            const { data } = await axiosClient.post(

                `/submissions/run/${problem._id}`,

                {

                    language,

                    code,

                }

            );

            setRunResult(data);

            setSubmitResult(null);

            toast.success("Code Executed Successfully");

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Execution Failed"

            );

        } finally {

            setIsRunning(false);

        }

    }

    async function submitCode() {

        if (isSubmitting || isRunning) return;

        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }

        try {

            setIsSubmitting(true);
            setRunResult(null);
            setSubmitResult({ status: "queued", loading: true });

            const { data } = await axiosClient.post(

                `/submissions/submit/${problem._id}`,

                {

                    language,

                    code,

                }

            );

            const submissionId = data.submissionId;

            if (!submissionId) {
                throw new Error("No submission ID returned");
            }

            toast("Code queued for execution...", {
                icon: "⏳",
            });

            let attempts = 0;
            const maxAttempts = 40; // 40 * 1.5s = 60s timeout

            pollIntervalRef.current = setInterval(async () => {
                attempts++;
                try {
                    const { data: statusData } = await axiosClient.get(
                        `/submissions/status/${submissionId}`
                    );

                    if (statusData.status === "queued" || statusData.status === "processing") {
                        setSubmitResult({
                            ...statusData,
                            loading: true,
                        });

                        if (attempts >= maxAttempts) {
                            clearInterval(pollIntervalRef.current);
                            pollIntervalRef.current = null;
                            setIsSubmitting(false);
                            setSubmitResult({
                                status: "error",
                                errorMessage: "Execution timed out. Please check submission history.",
                            });
                            toast.error("Execution timed out");
                        }
                    } else {
                        // Execution completed
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                        setIsSubmitting(false);
                        setSubmitResult(statusData);

                        if (statusData.accepted) {
                            toast.success("Accepted! All test cases passed 🎉");
                        } else if (statusData.status === "wrong") {
                            toast.error("Wrong Answer ❌");
                        } else {
                            toast.error(statusData.errorMessage || "Submission Failed");
                        }
                    }
                } catch (pollErr) {
                    console.error("Polling error:", pollErr);
                    if (attempts >= maxAttempts) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                        setIsSubmitting(false);
                        toast.error("Failed to check submission status");
                    }
                }
            }, 1500);

        }

        catch (err) {

            setIsSubmitting(false);
            setSubmitResult(null);
            toast.error(

                err.response?.data?.message ||
                err.message ||
                "Submission Failed"

            );

        }

    }

    return (

        <div className="flex flex-col h-full">

            {/* Header */}

            <div className="flex justify-between items-center p-4 border-b bg-base-200">

                <select

                    className="select select-bordered"

                    value={language}

                    onChange={(e) =>

                        setLanguage(e.target.value)

                    }

                >

                    <option value="cpp">

                        C++

                    </option>

                    <option value="java">

                        Java

                    </option>

                    <option value="python">

                        Python

                    </option>

                    <option value="javascript">

                        JavaScript

                    </option>

                </select>

                <div className="space-x-3">

                    <button

                        className="btn btn-outline"

                        onClick={runCode}

                        disabled={isRunning || isSubmitting}

                    >

                        {isRunning ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                            <FaPlay />
                        )}

                        Run

                    </button>

                    <button

                        className="btn btn-primary"

                        onClick={submitCode}

                        disabled={isSubmitting || isRunning}

                    >

                        {isSubmitting ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                            <FaCloudUploadAlt />
                        )}

                        {isSubmitting ? "Processing..." : "Submit"}

                    </button>

                </div>

            </div>

            {/* Monaco */}

            <div className="flex-1">

                <Editor

                    height="100%"

                    language={languageMap[language]}

                    theme="vs-dark"

                    value={code}

                    onChange={(value) =>

                        setCode(value || "")

                    }

                    options={{

                        minimap: {

                            enabled: false,

                        },

                        automaticLayout: true,

                        fontSize: 15,

                        scrollBeyondLastLine: false,

                        tabSize: 4,

                    }}

                />

            </div>

        </div>

    );

}

export default CodeEditor;