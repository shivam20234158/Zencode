function ProblemDescription({ problem }) {

    if (!problem) {

        return (
            <div className="flex justify-center items-center h-full">
                Loading...
            </div>
        );

    }

    return (

        <div className="p-6 space-y-6">

            {/* Title */}

            <div>

                <h1 className="text-3xl font-bold">

                    {problem.title}

                </h1>

                <div className="flex flex-wrap gap-3 mt-3">

                    <span
                        className={`badge text-white font-semibold ${
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

            </div>

            {/* Description */}

            <div>

                <h2 className="text-xl font-bold mb-2">

                    Description

                </h2>

                <div className="bg-base-200 rounded-lg p-4 leading-7 whitespace-pre-wrap">

                    {problem.description}

                </div>

            </div>

            {/* Constraints */}

            {

                problem.constraints && (

                    <div>

                        <h2 className="text-xl font-bold mb-2">

                            Constraints

                        </h2>

                        <div className="bg-base-200 rounded-lg p-4 font-mono whitespace-pre-wrap">

                            {problem.constraints}

                        </div>

                    </div>

                )

            }

            {/* Examples */}

            <div>

                <h2 className="text-xl font-bold mb-3">

                    Examples

                </h2>

                <div className="space-y-5">

                    {

                        problem.visibleTestCases?.map(

                            (testCase, index) => (

                                <div
                                    key={index}
                                    className="bg-base-200 rounded-xl p-5"
                                >

                                    <h3 className="font-bold mb-3">

                                        Example {index + 1}

                                    </h3>

                                    <div className="space-y-3">

                                        <div>

                                            <span className="font-semibold">

                                                Input

                                            </span>

                                            <pre className="bg-base-100 rounded p-3 mt-2 overflow-auto">

{testCase.input}

                                            </pre>

                                        </div>

                                        <div>

                                            <span className="font-semibold">

                                                Output

                                            </span>

                                            <pre className="bg-base-100 rounded p-3 mt-2 overflow-auto">

{testCase.output}

                                            </pre>

                                        </div>

                                        {

                                            testCase.explanation && (

                                                <div>

                                                    <span className="font-semibold">

                                                        Explanation

                                                    </span>

                                                    <pre className="bg-base-100 rounded p-3 mt-2 whitespace-pre-wrap">

{testCase.explanation}

                                                    </pre>

                                                </div>

                                            )

                                        }

                                    </div>

                                </div>

                            )

                        )

                    }

                </div>

            </div>

        </div>

    );

}

export default ProblemDescription;