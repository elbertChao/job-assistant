import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const ResumeAnalyzer = () => {
    const [resumeText, setResumeText] = useState("");
    const [result, setResult] = useState(null);
    const handleAnalyze = () => {
        // Replace with analyzeResume API later
        setResult({
            score: 85,
            feedback: "Great resume! Strong alignment with job requirements.",
        });
    };
    return (_jsxs("div", { className: "max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Resume Analyzer" }), _jsx("textarea", { rows: 6, className: "w-full p-2 border border-gray-300 rounded", placeholder: "Paste your resume here...", value: resumeText, onChange: (e) => setResumeText(e.target.value) }), _jsx("button", { onClick: handleAnalyze, className: "mt-4 w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700", children: "Analyze Resume" }), result && (_jsxs("div", { className: "mt-4 p-4 bg-gray-100 rounded", children: [_jsxs("p", { children: [_jsx("strong", { children: "Score:" }), " ", result.score] }), _jsxs("p", { children: [_jsx("strong", { children: "Feedback:" }), " ", result.feedback] })] }))] }));
};
export default ResumeAnalyzer;
