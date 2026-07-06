import { useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaInfoCircle, FaFileCode, FaVials } from "react-icons/fa";
import toast from "react-hot-toast";

function AdminCreate({ onBack }) {
    const [activeFormTab, setActiveFormTab] = useState("general"); // "general" | "testcases" | "code"
    
    // Form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [tags, setTags] = useState("");
    const [constraints, setConstraints] = useState("");

    // Testcases
    const [visibleTestCases, setVisibleTestCases] = useState([{ input: "", output: "", explanation: "" }]);
    const [hiddenTestCases, setHiddenTestCases] = useState([{ input: "", output: "" }]);

    // Starter code & Reference Solution for C++, Java, Python, JS
    const [startCode, setStartCode] = useState({
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // write code here\n    return 0;\n}",
        java: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // write code here\n    }\n}",
        python: "# write code here\n",
        javascript: "// write code here\n"
    });

    const [refSolution, setRefSolution] = useState({
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Reference solution code\n    return 0;\n}",
        java: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Reference solution code\n    }\n}",
        python: "# Reference solution code\n",
        javascript: "// Reference solution code\n"
    });

    const [saving, setSaving] = useState(false);

    // Visible Testcases Handlers
    const addVisibleTestCase = () => {
        setVisibleTestCases([...visibleTestCases, { input: "", output: "", explanation: "" }]);
    };
    const removeVisibleTestCase = (index) => {
        setVisibleTestCases(visibleTestCases.filter((_, idx) => idx !== index));
    };
    const handleVisibleTestCaseChange = (index, field, value) => {
        const updated = [...visibleTestCases];
        updated[index][field] = value;
        setVisibleTestCases(updated);
    };

    // Hidden Testcases Handlers
    const addHiddenTestCase = () => {
        setHiddenTestCases([...hiddenTestCases, { input: "", output: "" }]);
    };
    const removeHiddenTestCase = (index) => {
        setHiddenTestCases(hiddenTestCases.filter((_, idx) => idx !== index));
    };
    const handleHiddenTestCaseChange = (index, field, value) => {
        const updated = [...hiddenTestCases];
        updated[index][field] = value;
        setHiddenTestCases(updated);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            toast.error("Title and Description are required");
            return;
        }

        try {
            setSaving(true);
            
            // Format tags as array
            const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);

            // Format startCode
            const formattedStartCode = Object.keys(startCode).map(lang => ({
                language: lang,
                initialCode: startCode[lang]
            }));

            // Format referenceSolution
            const formattedRefSolution = Object.keys(refSolution).map(lang => ({
                language: lang,
                completeCode: refSolution[lang]
            }));

            const payload = {
                title,
                description,
                difficulty,
                tags: tagsArray,
                constraints,
                visibleTestCases,
                hiddenTestCases,
                startCode: formattedStartCode,
                referenceSolution: formattedRefSolution
            };

            await axiosClient.post("/problems/create", payload);
            toast.success("Problem created successfully!");
            onBack();
        } catch (err) {
            console.error("Failed to create problem:", err);
            toast.error(err.response?.data?.message || "Failed to create problem.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
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
                <button
                    type="submit"
                    className="btn btn-primary btn-sm font-bold flex items-center gap-1.5"
                    disabled={saving}
                >
                    {saving ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <FaSave />
                    )}
                    Save Problem
                </button>
            </div>

            {/* Form tabs */}
            <div className="tabs tabs-lifted bg-base-200 p-2.5 rounded-xl border border-base-300">
                <button
                    type="button"
                    className={`tab gap-1.5 font-bold ${activeFormTab === "general" ? "tab-active" : ""}`}
                    onClick={() => setActiveFormTab("general")}
                >
                    <FaInfoCircle />
                    General Info
                </button>
                <button
                    type="button"
                    className={`tab gap-1.5 font-bold ${activeFormTab === "testcases" ? "tab-active" : ""}`}
                    onClick={() => setActiveFormTab("testcases")}
                >
                    <FaVials />
                    Test Cases
                </button>
                <button
                    type="button"
                    className={`tab gap-1.5 font-bold ${activeFormTab === "code" ? "tab-active" : ""}`}
                    onClick={() => setActiveFormTab("code")}
                >
                    <FaFileCode />
                    Language Templates
                </button>
            </div>

            {/* Form Body */}
            <div className="p-2 space-y-4">
                {activeFormTab === "general" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4 md:col-span-2">
                            <div>
                                <label className="label label-text font-bold pb-1 text-sm">Problem Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Two Sum"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="input input-bordered w-full focus:outline-none focus:border-primary text-sm h-11"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label label-text font-bold pb-1 text-sm">Problem Description</label>
                                <textarea
                                    placeholder="Write a clear, descriptive problem outline..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="textarea textarea-bordered w-full h-44 focus:outline-none focus:border-primary text-sm font-sans"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label label-text font-bold pb-1 text-sm">Difficulty</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="select select-bordered w-full text-sm h-11 min-h-0"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="label label-text font-bold pb-1 text-sm">Tags (Comma Separated)</label>
                            <input
                                type="text"
                                placeholder="array, hash-table, math"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="input input-bordered w-full focus:outline-none focus:border-primary text-sm h-11"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="label label-text font-bold pb-1 text-sm">Constraints</label>
                            <textarea
                                placeholder="e.g., 2 <= nums.length <= 10^4"
                                value={constraints}
                                onChange={(e) => setConstraints(e.target.value)}
                                className="textarea textarea-bordered w-full h-24 focus:outline-none focus:border-primary text-sm font-mono"
                            />
                        </div>
                    </div>
                )}

                {activeFormTab === "testcases" && (
                    <div className="space-y-6">
                        {/* Visible Testcases */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="text-md font-bold text-primary">Visible Test Cases (Examples)</h3>
                                <button
                                    type="button"
                                    onClick={addVisibleTestCase}
                                    className="btn btn-xs btn-outline btn-primary"
                                >
                                    <FaPlus /> Add Example
                                </button>
                            </div>
                            
                            {visibleTestCases.map((tc, idx) => (
                                <div key={idx} className="bg-base-200 p-4 rounded-xl border border-base-300 relative space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-xs">Example {idx + 1}</span>
                                        {visibleTestCases.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVisibleTestCase(idx)}
                                                className="btn btn-ghost btn-square btn-xs text-error"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[11px] font-bold opacity-60">Input</label>
                                            <textarea
                                                value={tc.input}
                                                onChange={(e) => handleVisibleTestCaseChange(idx, "input", e.target.value)}
                                                className="textarea textarea-bordered textarea-sm w-full font-mono mt-0.5 text-xs h-16"
                                                placeholder="nums = [2,7,11,15], target = 9"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold opacity-60">Output</label>
                                            <textarea
                                                value={tc.output}
                                                onChange={(e) => handleVisibleTestCaseChange(idx, "output", e.target.value)}
                                                className="textarea textarea-bordered textarea-sm w-full font-mono mt-0.5 text-xs h-16"
                                                placeholder="[0,1]"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-[11px] font-bold opacity-60">Explanation (Optional)</label>
                                            <input
                                                type="text"
                                                value={tc.explanation}
                                                onChange={(e) => handleVisibleTestCaseChange(idx, "explanation", e.target.value)}
                                                className="input input-bordered input-sm w-full mt-0.5 text-xs h-9"
                                                placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Hidden Testcases */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="text-md font-bold text-primary">Hidden Test Cases (Validation)</h3>
                                <button
                                    type="button"
                                    onClick={addHiddenTestCase}
                                    className="btn btn-xs btn-outline btn-primary"
                                >
                                    <FaPlus /> Add Test Case
                                </button>
                            </div>
                            
                            {hiddenTestCases.map((tc, idx) => (
                                <div key={idx} className="bg-base-200 p-4 rounded-xl border border-base-300 relative space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-xs">Validation Test Case {idx + 1}</span>
                                        {hiddenTestCases.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeHiddenTestCase(idx)}
                                                className="btn btn-ghost btn-square btn-xs text-error"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[11px] font-bold opacity-60">Input</label>
                                            <textarea
                                                value={tc.input}
                                                onChange={(e) => handleHiddenTestCaseChange(idx, "input", e.target.value)}
                                                className="textarea textarea-bordered textarea-sm w-full font-mono mt-0.5 text-xs h-16"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold opacity-60">Output</label>
                                            <textarea
                                                value={tc.output}
                                                onChange={(e) => handleHiddenTestCaseChange(idx, "output", e.target.value)}
                                                className="textarea textarea-bordered textarea-sm w-full font-mono mt-0.5 text-xs h-16"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeFormTab === "code" && (
                    <div className="space-y-6">
                        {/* Start Codes and solutions inside collapsible divs */}
                        {["cpp", "java", "python", "javascript"].map((lang) => (
                            <div key={lang} className="collapse collapse-arrow bg-base-200 border border-base-300 rounded-2xl">
                                <input type="checkbox" /> 
                                <div className="collapse-title text-sm font-bold uppercase text-primary">
                                    {lang === "cpp" ? "C++ (G++ 17)" : lang}
                                </div>
                                <div className="collapse-content grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold label-text pb-1 block">Starter Code Template</label>
                                        <textarea
                                            value={startCode[lang]}
                                            onChange={(e) => setStartCode({ ...startCode, [lang]: e.target.value })}
                                            className="textarea textarea-bordered w-full h-64 font-mono text-xs focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold label-text pb-1 block">Reference Solution (Used to test cases)</label>
                                        <textarea
                                            value={refSolution[lang]}
                                            onChange={(e) => setRefSolution({ ...refSolution, [lang]: e.target.value })}
                                            className="textarea textarea-bordered w-full h-64 font-mono text-xs focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </form>
    );
}

export default AdminCreate;
