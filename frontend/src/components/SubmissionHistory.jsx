import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

function SubmissionHistory({ problemId }) {

    const [submissions, setSubmissions] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchSubmissions();

    }, [problemId]);

    async function fetchSubmissions() {

        try {

            const { data } = await axiosClient.get(
                `/submissions/history/${problemId}`
            );
            console.log("Submission API Response:", data);
            setSubmissions(Array.isArray(data) ? data : []);

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

            <div className="flex justify-center p-10">

                Loading...

            </div>

        );

    }

    if (submissions.length === 0) {

        return (

            <div className="flex justify-center p-10 text-gray-500">

                No submissions yet.

            </div>

        );

    }

    return (

        <div className="overflow-x-auto p-4">

            <table className="table">

                <thead>

                    <tr>

                        <th>Status</th>

                        <th>Language</th>

                        <th>Runtime</th>

                        <th>Memory</th>

                        <th>Submitted At</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        submissions.map((submission) => (

                            <tr key={submission._id}>

                                <td>

                                    <span
                                        className={`badge ${submission.status === "accepted"
                                                ? "badge-success"
                                                : "badge-error"
                                            }`}
                                    >

                                        {submission.status === "accepted"
                                            ? "Accepted"
                                            : "Wrong Answer"}

                                    </span>

                                </td>

                                <td>

                                    {submission.language}

                                </td>

                                <td>

                                    {submission.runtime || "--"}

                                </td>

                                <td>

                                    {submission.memory || "--"}

                                </td>

                                <td>

                                    {

                                        new Date(
                                            submission.createdAt
                                        ).toLocaleString()

                                    }

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default SubmissionHistory;