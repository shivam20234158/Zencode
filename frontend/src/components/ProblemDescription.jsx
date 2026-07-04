import React from "react";

function ProblemDescription({ problem }) {

    if (!problem) {
        return (
            <div className="flex items-center justify-center h-full">
                Loading...
            </div>
        );
    }

    return (

        <div className="p-6 overflow-y-auto h-full">

            <h1 className="text-3xl font-bold">
                {problem.title}
            </h1>

            <div className="flex gap-3 mt-4">

                <span
                    className={`badge ${
                        problem.difficulty === "Easy"
                            ? "badge-success"
                            : problem.difficulty === "Medium"
                            ? "badge-warning"
                            : "badge-error"
                    }`}
                >
                    {problem.difficulty}
                </span>

                {
                    problem.tags?.map((tag) => (

                        <span
                            key={tag}
                            className="badge badge-outline"
                        >
                            {tag}
                        </span>

                    ))
                }

            </div>

            <div className="divider"></div>

            <div>

                <h2 className="text-xl font-semibold mb-2">
                    Description
                </h2>

                <p className="whitespace-pre-wrap">
                    {problem.description}
                </p>

            </div>

            <div className="divider"></div>

            <div>

                <h2 className="text-xl font-semibold mb-2">
                    Constraints
                </h2>

                <p className="whitespace-pre-wrap">
                    {problem.constraints}
                </p>

            </div>

            <div className="divider"></div>

            <div>

                <h2 className="text-xl font-semibold mb-3">
                    Examples
                </h2>

                {
                    problem.visibleTestCases?.map((testCase, index) => (

                        <div
                            key={index}
                            className="bg-base-200 rounded-lg p-4 mb-4"
                        >

                            <h3 className="font-bold">
                                Example {index + 1}
                            </h3>

                            <p className="mt-2">
                                <strong>Input:</strong>
                            </p>

                            <pre>{testCase.input}</pre>

                            <p className="mt-2">
                                <strong>Output:</strong>
                            </p>

                            <pre>{testCase.output}</pre>

                            {
                                testCase.explanation && (

                                    <>
                                        <p className="mt-2">
                                            <strong>Explanation:</strong>
                                        </p>

                                        <pre>
                                            {testCase.explanation}
                                        </pre>
                                    </>

                                )
                            }

                        </div>

                    ))
                }

            </div>

        </div>

    );

}

export default ProblemDescription;