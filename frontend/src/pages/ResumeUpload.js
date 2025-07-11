import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
const ResumeUpload = () => {
    const { user } = useAuth();
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        }
        else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };
    const handleFile = async (file) => {
        console.log("⏩ handleFile started");
        if (!user) {
            toast.error("You must be signed in to upload");
            return;
        }
        setUploading(true);
        console.log("Uploading → true");
        // 1️⃣ Refresh the session (this will give you a new access_token)
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshedSession?.access_token) {
            console.error("Session refresh failed", refreshError);
            toast.error("Session refresh failed—please log in again.");
            setUploading(false);
            return;
        }
        const token = refreshedSession.access_token;
        console.log("Refreshed token:", token.slice(0, 10), "…");
        // 2️⃣ Build the form payload
        const form = new FormData();
        form.append("file", file);
        // 3️⃣ POST to your backend
        try {
            console.log("→ About to fetch /api/resume/upload");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/resume/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });
            console.log("← Fetch returned status", res.status);
            if (!res.ok) {
                const errText = await res.text();
                console.error("Fetch not ok:", errText);
                throw new Error(`Upload failed (${res.status}): ${errText}`);
            }
            const json = await res.json();
            console.log("✅ Upload succeeded:", json);
            // only now flip into “file uploaded” UI
            setUploadedFile(file);
            setExtractedText(json.content || `Saved ${json.title} (ID: ${json.id})`);
            toast.success("Resume uploaded and extracted!");
        }
        catch (err) {
            console.error("🚨 Error uploading resume:", err);
            toast.error(err.message || "Failed to upload resume");
            setUploadedFile(null);
            setExtractedText("");
        }
        finally {
            console.log("🔚 handleFile finally; Uploading → false");
            setUploading(false);
        }
    };
    const removeFile = () => {
        setUploadedFile(null);
        setExtractedText('');
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, {}), _jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, children: [_jsx("h1", { className: "text-3xl font-bold text-secondary-900 mb-2", children: "Upload Your Resume" }), _jsx("p", { className: "text-secondary-600 mb-8", children: "Upload your resume to get started with AI-powered analysis and job application assistance." }), !uploadedFile ? (_jsx("div", { className: "card", children: _jsxs("div", { className: `border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-300 ${dragActive
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-secondary-300 hover:border-primary-400 hover:bg-primary-50'}`, onDragEnter: handleDrag, onDragLeave: handleDrag, onDragOver: handleDrag, onDrop: handleDrop, children: [_jsx(Upload, { className: `mx-auto h-16 w-16 mb-4 ${dragActive ? 'text-primary-600' : 'text-secondary-400'}` }), _jsx("h3", { className: "text-lg font-semibold text-secondary-900 mb-2", children: "Drop your resume here, or click to browse" }), _jsx("p", { className: "text-secondary-600 mb-6", children: "Supports PDF, Word documents, and text files up to 10MB" }), _jsx("input", { type: "file", id: "resume-upload", className: "hidden", accept: ".pdf,.doc,.docx,.txt", onChange: handleChange, disabled: uploading }), _jsx("label", { htmlFor: "resume-upload", className: "btn-primary cursor-pointer inline-block", children: uploading ? 'Uploading...' : 'Choose File' })] }) })) : (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center", children: _jsx(CheckCircle, { className: "h-6 w-6 text-green-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-secondary-900", children: uploadedFile.name }), _jsxs("p", { className: "text-secondary-600 text-sm", children: [(uploadedFile.size / 1024 / 1024).toFixed(2), " MB \u2022 Uploaded successfully"] })] })] }), _jsx("button", { onClick: removeFile, className: "p-2 text-secondary-400 hover:text-secondary-600 transition-colors", children: _jsx(X, { className: "h-5 w-5" }) })] }) }), extractedText && (_jsxs("div", { className: "card", children: [_jsxs("h3", { className: "text-lg font-semibold text-secondary-900 mb-4 flex items-center", children: [_jsx(FileText, { className: "h-5 w-5 mr-2" }), "Extracted Content Preview"] }), _jsx("div", { className: "bg-secondary-50 rounded-lg p-4 max-h-96 overflow-y-auto", children: _jsxs("pre", { className: "text-sm text-secondary-700 whitespace-pre-wrap font-mono", children: [extractedText.substring(0, 1000), extractedText.length > 1000 && '...'] }) }), _jsxs("div", { className: "mt-4 flex space-x-4", children: [_jsx("button", { className: "btn-primary", children: "Analyze Resume" }), _jsx("button", { className: "btn-secondary", children: "Edit Content" })] })] }))] })), _jsxs("div", { className: "mt-8 card bg-primary-50 border-primary-200", children: [_jsx("h3", { className: "text-lg font-semibold text-primary-900 mb-4", children: "Tips for Better Results" }), _jsxs("ul", { className: "space-y-2 text-primary-800", children: [_jsxs("li", { className: "flex items-start space-x-2", children: [_jsx("span", { className: "text-primary-600 mt-1", children: "\u2022" }), _jsx("span", { children: "Use a clean, well-formatted resume for better text extraction" })] }), _jsxs("li", { className: "flex items-start space-x-2", children: [_jsx("span", { className: "text-primary-600 mt-1", children: "\u2022" }), _jsx("span", { children: "Include relevant keywords for your target industry" })] }), _jsxs("li", { className: "flex items-start space-x-2", children: [_jsx("span", { className: "text-primary-600 mt-1", children: "\u2022" }), _jsx("span", { children: "Make sure your contact information is clearly visible" })] }), _jsxs("li", { className: "flex items-start space-x-2", children: [_jsx("span", { className: "text-primary-600 mt-1", children: "\u2022" }), _jsx("span", { children: "PDF format typically provides the best results" })] })] })] })] }) })] }));
};
export default ResumeUpload;
