import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, AlertCircle, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
const ResumeScorer = () => {
    const { user } = useAuth();
    const [resumes, setResumes] = useState([]);
    const [jdUrl, setJdUrl] = useState("");
    const [jdText, setJdText] = useState(null);
    const [resumeText, setResumeText] = useState(null);
    const [selectedResume, setSelectedResume] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [scoreBreakdown, setScoreBreakdown] = useState([]);
    const [overallScore, setOverallScore] = useState(0);
    useEffect(() => {
        fetchResumes();
    }, [user]);
    const fetchResumes = async () => {
        if (!user)
            return;
        try {
            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setResumes(data || []);
        }
        catch (error) {
            console.error('Error fetching resumes:', error);
            toast.error('Failed to load resumes');
        }
    };
    const analyzeResume = async (resume) => {
        if (!jdUrl) {
            toast.error("Please enter a job description URL first");
            return;
        }
        setAnalyzing(true);
        setSelectedResume(resume);
        try {
            // 1) call your FastAPI scoring route
            const resp = await fetch(`${import.meta.env.VITE_API_URL}/generate/score`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resume_text: resume.content,
                    jd_url: jdUrl
                })
            });
            if (!resp.ok)
                throw new Error(await resp.text());
            const { overallScore, breakdown, jdText } = await resp.json();
            // 2) update local state to render
            setOverallScore(overallScore);
            setScoreBreakdown(breakdown);
            setResumeText(resume.content);
            setJdText(jdText);
            // 3) persist score back into Supabase
            const { error } = await supabase
                .from("resumes")
                .update({ score: overallScore })
                .eq("id", resume.id);
            if (error)
                throw error;
            toast.success("✅ Resume analysis complete!");
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to analyze resume");
        }
        finally {
            setAnalyzing(false);
        }
    };
    const getScoreColor = (score) => {
        if (score >= 80)
            return 'text-green-600';
        if (score >= 60)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    const getScoreBgColor = (score) => {
        if (score >= 80)
            return 'bg-green-100';
        if (score >= 60)
            return 'bg-yellow-100';
        return 'bg-red-100';
    };
    // ——— Download Report Handler ———
    const handleDownloadReport = () => {
        if (!selectedResume)
            return;
        const lines = [];
        lines.push(`Job Description URL: ${jdUrl}`);
        lines.push(``);
        lines.push(`--- Extracted Job Description ---`);
        lines.push(jdText || "");
        lines.push(``);
        lines.push(`--- Resume Content (${selectedResume.title}) ---`);
        lines.push(resumeText || selectedResume.content);
        lines.push(``);
        lines.push(`Overall Score: ${overallScore}%`);
        lines.push(``);
        lines.push(`--- Breakdown ---`);
        scoreBreakdown.forEach(item => {
            lines.push(`${item.category}: ${item.score}/${item.maxScore}`);
            lines.push(`  Feedback: ${item.feedback}`);
            if (item.suggestions.length) {
                lines.push(`  Suggestions:`);
                item.suggestions.forEach(s => lines.push(`    • ${s}`));
            }
            lines.push(``);
        });
        const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedResume.title.replace(/\s+/g, "_")}_report.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    // ——— Analyze Another Resume Handler ———
    const handleAnalyzeAnother = () => {
        setSelectedResume(null);
        setScoreBreakdown([]);
        setOverallScore(0);
        setJdUrl("");
        setJdText(null);
        setResumeText(null);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, {}), _jsx("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, children: [_jsx("h1", { className: "text-3xl font-bold text-secondary-900 mb-2", children: "Resume Scorer" }), _jsx("p", { className: "text-secondary-600 mb-8", children: "Get detailed feedback and scoring on your resume to improve your chances of landing interviews." }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "card", children: [_jsx("div", { className: "mb-4", children: _jsx("input", { type: "url", placeholder: "Enter job description URL", value: jdUrl, onChange: e => setJdUrl(e.target.value), className: "w-full px-3 py-2 border rounded" }) }), _jsx("h2", { className: "text-xl font-semibold text-secondary-900 mb-4", children: "Your Resumes" }), resumes.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(FileText, { className: "h-12 w-12 text-secondary-400 mx-auto mb-4" }), _jsx("p", { className: "text-secondary-600 mb-4", children: "No resumes uploaded yet" }), _jsx("button", { className: "btn-primary", children: "Upload Resume" })] })) : (_jsx("div", { className: "space-y-3", children: resumes.map((resume) => (_jsx("div", { className: `p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selectedResume?.id === resume.id
                                                        ? 'border-primary-500 bg-primary-50'
                                                        : 'border-secondary-200 hover:border-primary-300 hover:bg-primary-25'}`, onClick: () => analyzeResume(resume), children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-secondary-900 truncate", children: resume.title }), _jsx("p", { className: "text-sm text-secondary-600", children: new Date(resume.created_at).toLocaleDateString() })] }), resume.score && (_jsxs("div", { className: `px-2 py-1 rounded text-sm font-medium ${getScoreBgColor(resume.score)} ${getScoreColor(resume.score)}`, children: [resume.score, "%"] }))] }) }, resume.id))) }))] }) }), _jsx("div", { className: "lg:col-span-2", children: analyzing ? (_jsxs("div", { className: "card text-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-secondary-900 mb-2", children: "Analyzing Your Resume" }), _jsx("p", { className: "text-secondary-600", children: "Our AI is reviewing your resume and generating detailed feedback..." })] })) : selectedResume && scoreBreakdown.length > 0 ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-secondary-900", children: "Overall Score" }), _jsxs("div", { className: `text-4xl font-bold ${getScoreColor(overallScore)}`, children: [overallScore, "%"] })] }), _jsx("div", { className: "w-full bg-secondary-200 rounded-full h-3", children: _jsx("div", { className: `h-3 rounded-full transition-all duration-1000 ${overallScore >= 80 ? 'bg-green-500' :
                                                                overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`, style: { width: `${overallScore}%` } }) }), _jsx("p", { className: "text-secondary-600 mt-4", children: overallScore >= 80 ? 'Excellent! Your resume is well-optimized.' :
                                                            overallScore >= 60 ? 'Good foundation with room for improvement.' :
                                                                'Significant improvements needed to increase your chances.' })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-xl font-semibold text-secondary-900 mb-6", children: "Detailed Analysis" }), _jsx("div", { className: "space-y-6", children: scoreBreakdown.map((item, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5, delay: index * 0.1 }, className: "border-l-4 border-primary-500 pl-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-semibold text-secondary-900", children: item.category }), _jsxs("span", { className: `font-bold ${getScoreColor((item.score / item.maxScore) * 100)}`, children: [item.score, "/", item.maxScore] })] }), _jsx("p", { className: "text-secondary-600 mb-3", children: item.feedback }), item.suggestions.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-secondary-700 mb-2", children: "Suggestions for improvement:" }), _jsx("ul", { className: "space-y-1", children: item.suggestions.map((suggestion, idx) => (_jsxs("li", { className: "flex items-start space-x-2 text-sm text-secondary-600", children: [_jsx(AlertCircle, { className: "h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" }), _jsx("span", { children: suggestion })] }, idx))) })] }))] }, index))) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-xl font-semibold text-secondary-900 mb-4", children: "Job Description Extracted" }), _jsx("div", { className: "bg-secondary-50 text-sm text-secondary-800 p-4 rounded max-h-60 overflow-y-scroll whitespace-pre-wrap border border-secondary-200", children: jdText || "No job description text extracted." }), _jsx("h3", { className: "text-xl font-semibold text-secondary-900 mb-4 mt-6", children: "Resume Content Used" }), _jsx("div", { className: "bg-secondary-50 text-sm text-secondary-800 p-4 rounded max-h-60 overflow-y-scroll whitespace-pre-wrap border border-secondary-200", children: resumeText || "No resume content available." })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("button", { onClick: handleDownloadReport, className: "btn-primary", disabled: !selectedResume, children: "Download Report" }), _jsx("button", { onClick: handleAnalyzeAnother, className: "btn-secondary", children: "Analyze Another Resume" })] })] })) : (_jsxs("div", { className: "card text-center py-12", children: [_jsx(Star, { className: "h-16 w-16 text-secondary-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-secondary-900 mb-2", children: "Select a Resume to Analyze" }), _jsx("p", { className: "text-secondary-600", children: "Choose a resume from the left panel to get detailed scoring and feedback." })] })) })] })] }) })] }));
};
export default ResumeScorer;
