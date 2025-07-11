import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const GeneratedAnswer = () => {
    const [question, setQuestion] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [answer, setAnswer] = useState(null);
    const handleGenerate = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/generate/answer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: "test_user",
                    question,
                    job_description: jobDescription
                })
            });
            const data = await res.json();
            setAnswer(data.answer);
        }
        catch (err) {
            console.error(err);
            setAnswer("Failed to generate an answer.");
        }
    };
    return (_jsxs("div", { className: "max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Tailored Answer Generator" }), _jsx("input", { type: "text", placeholder: "Enter your interview question...", className: "w-full p-2 border border-gray-300 rounded mb-3", value: question, onChange: (e) => setQuestion(e.target.value), autoComplete: "question" }), _jsx("textarea", { rows: 4, placeholder: "Paste job description here...", className: "w-full p-2 border border-gray-300 rounded", value: jobDescription, onChange: (e) => setJobDescription(e.target.value) }), _jsx("button", { onClick: handleGenerate, className: "mt-4 w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700", children: "Generate Answer" }), answer && (_jsx("div", { className: "mt-4 p-4 bg-gray-100 rounded", children: _jsxs("p", { children: [_jsx("strong", { children: "Generated Answer:" }), " ", answer] }) }))] }));
};
export default GeneratedAnswer;
