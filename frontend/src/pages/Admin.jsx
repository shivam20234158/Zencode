import { useState } from "react";
import AdminPanel from "../components/admin/AdminPanel";
import AdminCreate from "../components/admin/AdminCreate";
import AdminUpdate from "../components/admin/AdminUpdate";
import AdminVideo from "../components/admin/AdminVideo";
import { FaShieldAlt } from "react-icons/fa";

function Admin() {
    const [view, setView] = useState("panel"); // "panel" | "create" | "update" | "video"
    const [activeProblemId, setActiveProblemId] = useState(null);

    const handleCreate = () => {
        setView("create");
    };

    const handleUpdate = (problemId) => {
        setActiveProblemId(problemId);
        setView("update");
    };

    const handleVideo = (problemId) => {
        setActiveProblemId(problemId);
        setView("video");
    };

    const handleBack = () => {
        setView("panel");
        setActiveProblemId(null);
    };

    return (
        <div className="min-h-screen bg-base-200 py-10 px-5">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Admin Title Banner */}
                <div className="flex items-center gap-3 bg-neutral text-neutral-content p-5 rounded-2xl shadow border border-base-300">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-xl shadow-inner">
                        <FaShieldAlt />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
                        <p className="text-sm opacity-70">Manage coding problems, starting templates, and video solutions.</p>
                    </div>
                </div>

                {/* Sub-views rendering */}
                <div className="card bg-base-100 border border-base-300 shadow-xl p-6">
                    {view === "panel" && (
                        <AdminPanel
                            onCreate={handleCreate}
                            onUpdate={handleUpdate}
                            onVideo={handleVideo}
                        />
                    )}

                    {view === "create" && (
                        <AdminCreate
                            onBack={handleBack}
                        />
                    )}

                    {view === "update" && (
                        <AdminUpdate
                            problemId={activeProblemId}
                            onBack={handleBack}
                        />
                    )}

                    {view === "video" && (
                        <AdminVideo
                            problemId={activeProblemId}
                            onBack={handleBack}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;