import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axiosClient from "../utils/axiosClient";

import Loader from "../components/Loader";
import ProblemTabs from "../components/ProblemTabs";
import CodeEditor from "../components/CodeEditor";
import OutputConsole from "../components/OutputConsole";

function ProblemDetails() {

    const { problemId } = useParams();

    const [problem, setProblem] = useState(null);

    const [loading, setLoading] = useState(true);

    const [language, setLanguage] = useState("cpp");

    const [code, setCode] = useState("");

    const [runResult, setRunResult] = useState(null);

    const [submitResult, setSubmitResult] = useState(null);

    useEffect(() => {

        fetchProblem();

    }, [problemId]);

    async function fetchProblem() {

        try {

            const { data } = await axiosClient.get(
                `/problem/${problemId}`
            );

            setProblem(data);

            const starter = data.startCode?.find(
                (item) => item.language === "cpp"
            );

            if (starter) {

                setCode(starter.initialCode);

            }

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return <Loader />;

    }

    return (

        <div className="h-[calc(100vh-64px)] flex">

            {/* LEFT PANEL */}

            <div className="w-1/2 border-r">

                <ProblemTabs

                    problem={problem}

                />

            </div>

            {/* RIGHT PANEL */}

            <div className="w-1/2 flex flex-col">

                <CodeEditor

                    problem={problem}

                    language={language}

                    setLanguage={setLanguage}

                    code={code}

                    setCode={setCode}

                    setRunResult={setRunResult}

                    setSubmitResult={setSubmitResult}

                />

                <OutputConsole

                    runResult={runResult}

                    submitResult={submitResult}

                    problem={problem}

                />

            </div>

        </div>

    );

}

export default ProblemDetails;