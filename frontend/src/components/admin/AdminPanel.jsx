import { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import AdminDelete from "./AdminDelete";
import { FaPlus, FaSearch, FaEdit, FaVideo, FaTrash, FaQuestionCircle } from "react-icons/fa";
import toast from "react-hot-toast";

function AdminPanel({ onCreate, onUpdate, onVideo }) {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get("/problems");
            setProblems(data.problems || []);
        } catch (err) {
            console.error("Failed to load problems:", err);
            toast.error("Failed to fetch problems list.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (problem) => {
        setSelectedProblem(problem);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProblem) return;

        try {
            await axiosClient.delete(`/problems/delete/${selectedProblem._id}`);
            toast.success("Problem deleted successfully.");
            setProblems((prev) => prev.filter((p) => p._id !== selectedProblem._id));
        } catch (err) {
            console.error("Failed to delete problem:", err);
            toast.error(err.response?.data?.message || "Failed to delete problem.");
        } finally {
            setDeleteModalOpen(false);
            setSelectedProblem(null);
        }
    };

    const filteredProblems = problems.filter((problem) =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-80">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-base-content/40">
                        <FaSearch className="text-sm" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by title or tag..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-bordered w-full pl-9 h-10 min-h-0 text-sm focus:outline-none"
                    />
                </div>

                <button
                    onClick={onCreate}
                    className="btn btn-primary h-10 min-h-0 font-bold w-full sm:w-auto"
                >
                    <FaPlus />
                    Create Problem
                </button>
            </div>

            {/* Problems List Table */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner text-primary loading-lg"></span>
                </div>
            ) : filteredProblems.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-base-300 rounded-2xl bg-base-200/40">
                    <FaQuestionCircle className="text-5xl text-base-content/20 mx-auto mb-3" />
                    <h3 className="text-lg font-bold">No Problems Found</h3>
                    <p className="text-sm text-base-content/60">Try searching another term, or create a new problem!</p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-base-300 rounded-2xl bg-base-100 shadow-inner">
                    <table className="table table-zebra w-full text-sm">
                        <thead>
                            <tr className="bg-base-200">
                                <th className="font-bold">Title</th>
                                <th className="font-bold">Difficulty</th>
                                <th className="font-bold">Tags</th>
                                <th className="font-bold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProblems.map((problem) => (
                                <tr key={problem._id}>
                                    <td className="font-semibold">{problem.title}</td>
                                    <td>
                                        <span className={`badge font-bold py-2.5 px-3 border ${
                                            problem.difficulty === "Easy"
                                                ? "bg-success/15 border-success text-success"
                                                : problem.difficulty === "Medium"
                                                ? "bg-warning/15 border-warning text-warning"
                                                : "bg-error/15 border-error text-error"
                                        }`}>
                                            {problem.difficulty}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {problem.tags.map((tag) => (
                                                <span key={tag} className="badge badge-sm badge-outline font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => onUpdate(problem._id)}
                                                className="btn btn-square btn-ghost btn-sm text-info hover:bg-info/10"
                                                title="Edit Problem"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => onVideo(problem._id)}
                                                className="btn btn-square btn-ghost btn-sm text-warning hover:bg-warning/10"
                                                title="Manage Video Solution"
                                            >
                                                <FaVideo />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(problem)}
                                                className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                                                title="Delete Problem"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Reusable Delete Modal */}
            <AdminDelete
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSelectedProblem(null);
                }}
                onConfirm={handleDeleteConfirm}
                problemTitle={selectedProblem?.title}
            />
        </div>
    );
}

export default AdminPanel;
