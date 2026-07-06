import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUserCircle, FaEnvelope, FaShieldAlt } from "react-icons/fa";

import { deleteProfile } from "../store/authSlice";
import Dashboard from "../components/Dashboard";

function Profile() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your profile? All your progress and submissions will be permanently removed."
        );

        if (!confirmDelete) return;

        const result = await dispatch(deleteProfile());

        if (deleteProfile.fulfilled.match(result)) {
            toast.success("Profile Deleted");
            navigate("/");
        } else {
            toast.error("Unable to delete profile");
        }
    };

    return (
        <div className="min-h-screen bg-base-200 py-10 px-5">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 items-start animate-fade-in">
                {/* LEFT PROFILE CARD */}
                <div className="card bg-base-100 shadow-xl border border-base-300 lg:sticky lg:top-20">
                    <div className="card-body">
                        <h2 className="text-3xl font-extrabold text-center mb-6">
                            My Profile
                        </h2>

                        <div className="flex flex-col items-center mb-6">
                            <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-24 h-24 shadow-md flex items-center justify-center">
                                    <span className="text-3xl font-bold uppercase">
                                        {user?.firstName?.slice(0, 2) || "U"}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mt-3 capitalize">{user?.firstName} {user?.lastName}</h3>
                            <span className="badge badge-primary badge-outline mt-1 font-semibold capitalize">{user?.role}</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 bg-base-200/55 p-3 rounded-xl">
                                <FaUserCircle className="text-primary text-lg" />
                                <div>
                                    <p className="text-xs text-base-content/60 font-semibold">Name</p>
                                    <p className="font-semibold text-sm capitalize">{user?.firstName} {user?.lastName || ""}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-base-200/55 p-3 rounded-xl">
                                <FaEnvelope className="text-primary text-lg" />
                                <div>
                                    <p className="text-xs text-base-content/60 font-semibold">Email</p>
                                    <p className="font-semibold text-sm break-all">{user?.emailId}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-base-200/55 p-3 rounded-xl">
                                <FaShieldAlt className="text-primary text-lg" />
                                <div>
                                    <p className="text-xs text-base-content/60 font-semibold">Permissions Role</p>
                                    <p className="font-semibold text-sm capitalize">{user?.role || "User"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="divider my-6"></div>

                        <button
                            onClick={handleDelete}
                            className="btn btn-error btn-outline w-full font-bold"
                        >
                            Delete Profile
                        </button>
                    </div>
                </div>

                {/* RIGHT DASHBOARD STATS */}
                <div className="lg:col-span-2">
                    <Dashboard />
                </div>
            </div>
        </div>
    );
}

export default Profile;