import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axiosClient from "../utils/axiosClient";

import ProblemTabs from "../components/ProblemTabs";
import CodeEditor from "../components/CodeEditor";

function ProblemDetails() {

    const { problemId } = useParams();

    const [problem, setProblem] = useState(null);

    useEffect(() => {

        fetchProblem();

    }, [problemId]);

    async function fetchProblem() {

        try {

            const { data } = await axiosClient.get(
                `/problems/${problemId}`
            );

            setProblem(data);

        }

        catch (err) {

            console.log(err);

        }

    }

    if (!problem) {

        return (
            <div className="flex justify-center mt-10">

                Loading...

            </div>
        );

    }

    return (

        <div className="h-[calc(100vh-64px)] flex">

            <div className="w-1/2 border-r">

                <ProblemTabs
                    problem={problem}
                />

            </div>

            <div className="w-1/2">

                <CodeEditor
                    problem={problem}
                />

            </div>

        </div>

    );

}

export default ProblemDetails;