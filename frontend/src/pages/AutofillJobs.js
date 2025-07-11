import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ExternalLink, Calendar, Building, DollarSign, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
const AutofillJobs = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        company_name: '',
        position: '',
        job_url: '',
        status: 'applied',
        applied_date: new Date().toISOString().split('T')[0],
        notes: ''
    });
    useEffect(() => {
        fetchApplications();
    }, [user]);
    const fetchApplications = async () => {
        if (!user)
            return;
        try {
            const { data, error } = await supabase
                .from('job_applications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setApplications(data || []);
        }
        catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load job applications');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user)
            return;
        try {
            const { error } = await supabase
                .from('job_applications')
                .insert({
                user_id: user.id,
                ...formData
            });
            if (error)
                throw error;
            toast.success('Job application added successfully!');
            setShowAddForm(false);
            setFormData({
                company_name: '',
                position: '',
                job_url: '',
                status: 'applied',
                applied_date: new Date().toISOString().split('T')[0],
                notes: ''
            });
            fetchApplications();
        }
        catch (error) {
            console.error('Error adding application:', error);
            toast.error('Failed to add job application');
        }
    };
    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('job_applications')
                .update({ status: newStatus })
                .eq('id', id);
            if (error)
                throw error;
            toast.success('Status updated successfully!');
            fetchApplications();
        }
        catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'applied': return 'bg-blue-100 text-blue-800';
            case 'interview': return 'bg-yellow-100 text-yellow-800';
            case 'offer': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const autofillDemo = () => {
        // Simulate autofill functionality
        setFormData({
            company_name: 'TechCorp Inc.',
            position: 'Senior Software Engineer',
            job_url: 'https://example.com/job/12345',
            status: 'applied',
            applied_date: new Date().toISOString().split('T')[0],
            notes: 'Auto-filled from resume data: 5+ years React experience, Full-stack development, Team leadership'
        });
        toast.success('Form auto-filled with your resume data!');
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, {}), _jsx("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-secondary-900 mb-2", children: "Job Applications" }), _jsx("p", { className: "text-secondary-600", children: "Track your job applications and use autofill to speed up the application process." })] }), _jsxs("button", { onClick: () => setShowAddForm(true), className: "btn-primary flex items-center space-x-2", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { children: "Add Application" })] })] }), _jsx("div", { className: "card mb-8 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-primary-900 mb-2", children: "\uD83D\uDE80 Smart Autofill Feature" }), _jsx("p", { className: "text-primary-700 mb-4", children: "Save time by automatically filling job applications with your resume data. Our AI extracts relevant information and populates forms instantly." }), _jsxs("div", { className: "flex space-x-4 text-sm text-primary-600", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsx("span", { children: "Save 10+ minutes per application" })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(DollarSign, { className: "h-4 w-4" }), _jsx("span", { children: "Increase application volume by 300%" })] })] })] }), _jsx("button", { onClick: autofillDemo, className: "btn-primary", children: "Try Autofill Demo" })] }) }), showAddForm && (_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: "card mb-8", children: [_jsx("h2", { className: "text-xl font-semibold text-secondary-900 mb-6", children: "Add New Application" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-secondary-700 mb-2", children: "Company Name *" }), _jsx("input", { type: "text", required: true, value: formData.company_name, onChange: (e) => setFormData({ ...formData, company_name: e.target.value }), className: "input-field", placeholder: "Enter company name", autoComplete: 'organization-name' })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-secondary-700 mb-2", children: "Position *" }), _jsx("input", { type: "text", required: true, value: formData.position, onChange: (e) => setFormData({ ...formData, position: e.target.value }), className: "input-field", placeholder: "Enter position title", autoComplete: 'job-title' })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-secondary-700 mb-2", children: "Job URL" }), _jsx("input", { type: "url", value: formData.job_url, onChange: (e) => setFormData({ ...formData, job_url: e.target.value }), className: "input-field", placeholder: "https://..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-secondary-700 mb-2", children: "Applied Date" }), _jsx("input", { type: "date", value: formData.applied_date, onChange: (e) => setFormData({ ...formData, applied_date: e.target.value }), className: "input-field" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-secondary-700 mb-2", children: "Notes" }), _jsx("textarea", { value: formData.notes, onChange: (e) => setFormData({ ...formData, notes: e.target.value }), className: "input-field", rows: 3, placeholder: "Add any notes about this application..." })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("button", { type: "submit", className: "btn-primary", children: "Add Application" }), _jsx("button", { type: "button", onClick: () => setShowAddForm(false), className: "btn-secondary", children: "Cancel" })] })] })] })), _jsx("div", { className: "space-y-4", children: applications.length === 0 ? (_jsxs("div", { className: "card text-center py-12", children: [_jsx(Building, { className: "h-16 w-16 text-secondary-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-secondary-900 mb-2", children: "No Applications Yet" }), _jsx("p", { className: "text-secondary-600 mb-6", children: "Start tracking your job applications to stay organized and increase your success rate." }), _jsx("button", { onClick: () => setShowAddForm(true), className: "btn-primary", children: "Add Your First Application" })] })) : (applications.map((app) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: "card hover:shadow-lg transition-shadow duration-300", children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-secondary-900", children: app.position }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`, children: app.status.charAt(0).toUpperCase() + app.status.slice(1) })] }), _jsxs("div", { className: "flex items-center space-x-4 text-secondary-600 mb-3", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Building, { className: "h-4 w-4" }), _jsx("span", { children: app.company_name })] }), app.applied_date && (_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsx("span", { children: new Date(app.applied_date).toLocaleDateString() })] }))] }), app.notes && (_jsx("p", { className: "text-secondary-600 text-sm mb-3", children: app.notes })), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("select", { value: app.status, onChange: (e) => updateStatus(app.id, e.target.value), className: "text-sm border border-secondary-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "applied", children: "Applied" }), _jsx("option", { value: "interview", children: "Interview" }), _jsx("option", { value: "offer", children: "Offer" }), _jsx("option", { value: "rejected", children: "Rejected" })] }), app.job_url && (_jsxs("a", { href: app.job_url, target: "_blank", rel: "noopener noreferrer", className: "flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm", children: [_jsx(ExternalLink, { className: "h-4 w-4" }), _jsx("span", { children: "View Job" })] }))] })] }) }) }, app.id)))) })] }) })] }));
};
export default AutofillJobs;
