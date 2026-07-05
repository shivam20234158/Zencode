import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

const languageMap = {
    cpp: "cpp",
    java: "java",
    python: "python",
    javascript: "javascript",
};

function CodeEditor({ problem }) {

    const [language, setLanguage] = useState("cpp");
    const [code, setCode] = useState("");

    useEffect(() => {

        if (!problem) return;

        const starter = problem.startCode?.find(
            (item) => item.language === language
        );

        if (starter) {
            setCode(starter.initialCode);
        }

    }, [problem, language]);

    return (

        <div className="h-full flex flex-col">

            {/* Top Bar */}

            <div className="border-b p-4 flex justify-between items-center bg-base-200">

                <select
                    className="select select-bordered"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >

                    <option value="cpp">C++</option>

                    <option value="java">Java</option>

                    <option value="python">Python</option>

                    <option value="javascript">JavaScript</option>

                </select>

                <div className="space-x-3">

                    <button className="btn btn-outline">
                        Run
                    </button>

                    <button className="btn btn-primary">
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
                    onChange={(value) => setCode(value)}
                    options={{
                        fontSize: 15,
                        minimap: {
                            enabled: false,
                        },
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                    }}
                />

            </div>

            {/* Output */}

            <div className="border-t p-4 bg-base-100 h-40 overflow-auto">

                <h2 className="font-bold mb-2">
                    Output
                </h2>

                <p className="text-gray-500">
                    Run your code to see output.
                </p>

            </div>

        </div>

    );

}

export default CodeEditor;