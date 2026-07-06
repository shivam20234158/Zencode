import { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import axios from "axios";
import { FaArrowLeft, FaVideo, FaTrash, FaCloudUploadAlt, FaFilm, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../Loader";

function AdminVideo({ problemId, onBack }) {
    const [loading, setLoading] = useState(true);
    const [problem, setProblem] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (problemId) {
            fetchProblemDetails();
        }
    }, [problemId]);

    const fetchProblemDetails = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get(`/problems/${problemId}`);
            setProblem(data);
        } catch (err) {
            console.error("Failed to fetch problem details:", err);
            toast.error("Failed to load problem data.");
            onBack();
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("video/")) {
            setVideoFile(file);
        } else {
            toast.error("Please select a valid video file.");
            setVideoFile(null);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!videoFile || !problemId) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            // Step 1: Request signature from backend
            const { data: sigData } = await axiosClient.get(`/videos/create/${problemId}`);
            const { signature, timestamp, public_id, api_key, upload_url } = sigData;

            // Step 2: Assemble Cloudinary form data
            const formData = new FormData();
            formData.append("file", videoFile);
            formData.append("api_key", api_key);
            formData.append("timestamp", timestamp);
            formData.append("signature", signature);
            formData.append("public_id", public_id);

            // Step 3: Post directly to Cloudinary upload URL
            const cloudRes = await axios.post(upload_url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            const secureUrl = cloudRes.data.secure_url;
            const duration = cloudRes.data.duration || 0;

            // Step 4: Save metadata to backend
            await axiosClient.post("/videos/save", {
                problemId,
                cloudinaryPublicId: public_id,
                secureUrl,
                duration,
            });

            toast.success("Solution video uploaded successfully!");
            setVideoFile(null);
            fetchProblemDetails(); // Refresh view
        } catch (err) {
            console.error("Upload error:", err);
            toast.error(err.response?.data?.message || "Failed to upload video solution.");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDeleteVideo = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to permanently delete this solution video from Cloudinary?"
        );
        if (!confirmDelete) return;

        try {
            setLoading(true);
            await axiosClient.delete(`/videos/delete/${problemId}`);
            toast.success("Solution video deleted successfully.");
            fetchProblemDetails(); // Refresh view
        } catch (err) {
            console.error("Delete video error:", err);
            toast.error(err.response?.data?.message || "Failed to delete solution video.");
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="btn btn-ghost btn-sm flex items-center gap-1 text-base-content/85"
                >
                    <FaArrowLeft className="text-xs" />
                    Back to List
                </button>
                <h2 className="text-sm opacity-65 font-mono">Problem: {problem?.title}</h2>
            </div>

            {problem?.secureUrl ? (
                /* Video is already present */
                <div className="space-y-5">
                    <div className="alert bg-success/15 border-success text-success-content flex gap-3 text-sm py-3">
                        <FaFilm className="text-lg text-success" />
                        <span>A solution video is currently active for this problem.</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-start">
                        {/* Player preview */}
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-lg border border-base-300">
                            <video
                                src={problem.secureUrl}
                                controls
                                poster={problem.thumbnailUrl}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Metadata Details */}
                        <div className="card bg-base-200 p-5 rounded-2xl border border-base-300 space-y-4">
                            <h3 className="font-bold text-sm border-b pb-2">Video Info</h3>
                            <div className="space-y-2.5 text-xs font-mono">
                                <div>
                                    <span className="opacity-60 block">Secure URL:</span>
                                    <a
                                        href={problem.secureUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link link-primary break-all"
                                    >
                                        {problem.secureUrl}
                                    </a>
                                </div>
                                <div>
                                    <span className="opacity-60 block">Duration:</span>
                                    <span>{Math.round(problem.duration)} seconds</span>
                                </div>
                            </div>

                            <button
                                onClick={handleDeleteVideo}
                                className="btn btn-error btn-outline btn-sm font-bold w-full mt-2"
                            >
                                <FaTrash />
                                Delete Video
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* No video exists - upload form */
                <div className="max-w-md mx-auto py-8">
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl mx-auto mb-3">
                            <FaVideo />
                        </div>
                        <h3 className="text-lg font-bold">Upload Video Solution</h3>
                        <p className="text-xs text-base-content/65 mt-1">
                            Upload a solution walkthrough for this problem. Direct upload to Cloudinary.
                        </p>
                    </div>

                    <form onSubmit={handleUpload} className="card bg-base-200 border border-base-300 p-6 rounded-2xl space-y-4">
                        <div className="form-control w-full">
                            <label className="label font-bold text-xs pb-1.5 label-text">Select Video File</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                className="file-input file-input-bordered file-input-primary w-full text-xs"
                                disabled={uploading}
                                required
                            />
                        </div>

                        {uploading && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs font-bold font-mono">
                                    <span className="flex items-center gap-1.5 text-primary">
                                        <FaSpinner className="animate-spin" />
                                        Uploading...
                                    </span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-base-300 h-2.5 rounded-full overflow-hidden border border-base-100">
                                    <div
                                        className="bg-primary h-full transition-all duration-300 rounded-full"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-full font-bold h-11 min-h-0 text-sm"
                            disabled={!videoFile || uploading}
                        >
                            <FaCloudUploadAlt className="text-lg" />
                            Upload Video
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AdminVideo;