import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

function Problems() {

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchProblems();

    }, []);

    async function fetchProblems() {

        try {

            const { data } = await axiosClient.get(
                "/problems"
            );

            setProblems(data.problems);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (
            <div className="text-center mt-20">
                Loading...
            </div>
        );

    }

    return (

        <div className="max-w-6xl mx-auto mt-10">

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-4xl font-bold">
                    Problems
                </h1>

                <input
                    type="text"
                    placeholder="Search..."
                    className="input input-bordered w-72"
                />

            </div>

            <div className="overflow-x-auto">

                <table className="table">

                    <thead>

                        <tr>

                            <th>Title</th>

                            <th>Difficulty</th>

                            <th>Tags</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            problems.map((problem) => (

                                <tr key={problem._id}>

                                    <td>

                                        <Link
                                            to={`/problems/${problem._id}`}
                                            className="link link-hover"
                                        >
                                            {problem.title}
                                        </Link>

                                    </td>

                                    <td>

                                        <span
                                            className={
                                                problem.difficulty === "Easy"
                                                    ? "text-green-500"
                                                    : problem.difficulty === "Medium"
                                                    ? "text-yellow-500"
                                                    : "text-red-500"
                                            }
                                        >

                                            {problem.difficulty}

                                        </span>

                                    </td>

                                    <td>

                                        <div className="flex gap-2 flex-wrap">

                                            {

                                                problem.tags.map((tag) => (

                                                    <div
                                                        key={tag}
                                                        className="badge badge-outline"
                                                    >
                                                        {tag}
                                                    </div>

                                                ))

                                            }

                                        </div>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Problems;