import { useState } from "react";

import ProblemDescription from "./ProblemDescription";
import Editorial from "./Editorial";
import ChatAi from "./ChatAi";

function ProblemTabs({ problem }) {

    const [activeTab, setActiveTab] = useState("description");

    return (

        <div className="h-full flex flex-col">

            <div className="tabs tabs-boxed rounded-none border-b bg-base-200">

                <button
                    className={`tab ${activeTab === "description" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("description")}
                >
                    Description
                </button>

                <button
                    className={`tab ${activeTab === "editorial" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("editorial")}
                >
                    Editorial
                </button>

                <button
                    className={`tab ${activeTab === "ai" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("ai")}
                >
                    AI
                </button>

            </div>

            <div className="flex-1 overflow-y-auto">

                {activeTab === "description" &&
                    <ProblemDescription problem={problem} />}

                {activeTab === "editorial" &&
                    <Editorial problem={problem} />}

                {activeTab === "ai" &&
                    <ChatAi problem={problem} />}

            </div>

        </div>

    );

}

export default ProblemTabs;