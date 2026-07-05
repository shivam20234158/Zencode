import { useEffect } from "react";
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

        try {

            const { data } = await axiosClient.post(

                `/submission/run/${problem._id}`,

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

        }

    }

    async function submitCode() {

        try {

            const { data } = await axiosClient.post(

                `/submission/submit/${problem._id}`,

                {

                    language,

                    code,

                }

            );

            setSubmitResult(data);

            setRunResult(null);

            toast.success("Submission Complete");

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

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

                    >

                        <FaPlay />

                        Run

                    </button>

                    <button

                        className="btn btn-primary"

                        onClick={submitCode}

                    >

                        <FaCloudUploadAlt />

                        Submit

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