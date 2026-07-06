import { FaExclamationTriangle } from "react-icons/fa";

function AdminDelete({ isOpen, onClose, onConfirm, problemTitle }) {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box border border-error bg-base-100 max-w-sm rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center text-center p-2">
                    <div className="w-12 h-12 rounded-full bg-error/15 text-error flex items-center justify-center text-2xl mb-4">
                        <FaExclamationTriangle />
                    </div>
                    <h3 className="font-extrabold text-lg text-base-content">Delete Problem?</h3>
                    <p className="py-2 text-sm text-base-content/70">
                        Are you sure you want to permanently delete <strong>{problemTitle}</strong>? This action cannot be undone.
                    </p>
                </div>
                <div className="modal-action flex gap-2 justify-center mt-4">
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-error btn-sm font-bold text-white"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
            <div className="modal-backdrop bg-black/60" onClick={onClose}></div>
        </div>
    );
}

export default AdminDelete;
