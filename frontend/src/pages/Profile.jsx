import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { deleteProfile } from "../store/authSlice";

function Profile() {

    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = async () => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete your profile?"
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

        <div className="min-h-screen bg-base-200 flex justify-center py-10">

            <div className="card w-[600px] bg-base-100 shadow-xl">

                <div className="card-body">

                    <h2 className="text-3xl font-bold text-center mb-6">
                        My Profile
                    </h2>

                    <div className="space-y-5">

                        <div>

                            <p className="font-semibold">
                                Name
                            </p>

                            <p>{user?.firstName}</p>

                        </div>

                        <div>

                            <p className="font-semibold">
                                Email
                            </p>

                            <p>{user?.emailId}</p>

                        </div>

                        <div>

                            <p className="font-semibold">
                                Role
                            </p>

                            <p className="capitalize">
                                {user?.role}
                            </p>

                        </div>

                    </div>

                    <div className="divider"></div>

                    <button
                        onClick={handleDelete}
                        className="btn btn-error w-full"
                    >
                        Delete Profile
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Profile;