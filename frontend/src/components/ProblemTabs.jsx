import { useState } from "react";

import {
    FaBookOpen,
    FaVideo,
    FaRobot,
    FaHistory,
} from "react-icons/fa";

import ProblemDescription from "./ProblemDescription";
import Editorial from "./Editorial";
import ChatAi from "./ChatAi";
import SubmissionHistory from "./SubmissionHistory";

function ProblemTabs({ problem }) {

    const [activeTab, setActiveTab] = useState("description");

    return (

        <div className="h-full flex flex-col bg-base-100">

            {/* Tabs */}

            <div className="tabs tabs-lifted bg-base-200 px-3 pt-2">

                <button
                    className={`tab gap-2 ${
                        activeTab === "description"
                            ? "tab-active"
                            : ""
                    }`}
                    onClick={() =>
                        setActiveTab("description")
                    }
                >
                    <FaBookOpen />

                    Description

                </button>

                <button
                    className={`tab gap-2 ${
                        activeTab === "editorial"
                            ? "tab-active"
                            : ""
                    }`}
                    onClick={() =>
                        setActiveTab("editorial")
                    }
                >
                    <FaVideo />

                    Editorial

                </button>

                <button
                    className={`tab gap-2 ${
                        activeTab === "submissions"
                            ? "tab-active"
                            : ""
                    }`}
                    onClick={() =>
                        setActiveTab("submissions")
                    }
                >
                    <FaHistory />

                    Submissions

                </button>

                <button
                    className={`tab gap-2 ${
                        activeTab === "ai"
                            ? "tab-active"
                            : ""
                    }`}
                    onClick={() =>
                        setActiveTab("ai")
                    }
                >
                    <FaRobot />

                    AI Tutor

                </button>

            </div>

            {/* Content */}

            <div className="flex-1 overflow-y-auto">

                {

                    activeTab === "description" && (

                        <ProblemDescription
                            problem={problem}
                        />

                    )

                }

                {

                    activeTab === "editorial" && (

                        <Editorial
                            problem={problem}
                        />

                    )

                }

                {

                    activeTab === "submissions" && (

                        <SubmissionHistory
                            problemId={problem._id}
                        />

                    )

                }

                {

                    activeTab === "ai" && (

                        <ChatAi
                            problem={problem}
                        />

                    )

                }

            </div>

        </div>

    );

}

export default ProblemTabs;