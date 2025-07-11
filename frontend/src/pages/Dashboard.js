import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Target, TrendingUp, Upload, Star, Calendar, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        resumes: 0,
        applications: 0,
        averageScore: 0
    });
    useEffect(() => {
        const fetchStats = async () => {
            if (!user)
                return;
            try {
                // Fetch resume count
                const { count: resumeCount } = await supabase
                    .from('resumes')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);
                // Fetch application count
                const { count: applicationCount } = await supabase
                    .from('job_applications')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);
                // Fetch average resume score
                const { data: resumes } = await supabase
                    .from('resumes')
                    .select('score')
                    .eq('user_id', user.id)
                    .not('score', 'is', null);
                const averageScore = resumes && resumes.length > 0
                    ? resumes.reduce((sum, resume) => sum + (resume.score || 0), 0) / resumes.length
                    : 0;
                setStats({
                    resumes: resumeCount || 0,
                    applications: applicationCount || 0,
                    averageScore: Math.round(averageScore)
                });
            }
            catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, [user]);
    const quickActions = [
        {
            title: 'Upload Resume',
            description: 'Upload and analyze your resume',
            icon: Upload,
            link: '/resume-upload',
            color: 'bg-blue-500'
        },
        {
            title: 'Score Resume',
            description: 'Get detailed feedback on your resume',
            icon: Star,
            link: '/resume-scorer',
            color: 'bg-green-500'
        },
        {
            title: 'Practice Interview',
            description: 'Chat with AI for interview prep',
            icon: MessageSquare,
            link: '/interview-chat',
            color: 'bg-purple-500'
        },
        {
            title: 'Autofill Jobs',
            description: 'Auto-fill job applications',
            icon: Target,
            link: '/autofill-jobs',
            color: 'bg-orange-500'
        }
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, {}), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-secondary-900 mb-2", children: ["Welcome back, ", user?.user_metadata?.full_name || 'Job Seeker', "!"] }), _jsx("p", { className: "text-secondary-600", children: "Here's your job search progress and quick actions to help you land your next role." })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-6 mb-8", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.1 }, className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-secondary-600 text-sm font-medium", children: "Resumes" }), _jsx("p", { className: "text-3xl font-bold text-secondary-900", children: stats.resumes })] }), _jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center", children: _jsx(FileText, { className: "h-6 w-6 text-blue-600" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.2 }, className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-secondary-600 text-sm font-medium", children: "Applications" }), _jsx("p", { className: "text-3xl font-bold text-secondary-900", children: stats.applications })] }), _jsx("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center", children: _jsx(TrendingUp, { className: "h-6 w-6 text-green-600" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.3 }, className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-secondary-600 text-sm font-medium", children: "Avg. Resume Score" }), _jsxs("p", { className: "text-3xl font-bold text-secondary-900", children: [stats.averageScore, "%"] })] }), _jsx("div", { className: "w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center", children: _jsx(Star, { className: "h-6 w-6 text-purple-600" }) })] }) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.4 }, className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-secondary-900 mb-6", children: "Quick Actions" }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6", children: quickActions.map((action, index) => (_jsxs(Link, { to: action.link, className: "card hover:shadow-lg transition-all duration-300 group", children: [_jsx("div", { className: `w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`, children: _jsx(action.icon, { className: "h-6 w-6 text-white" }) }), _jsx("h3", { className: "text-lg font-semibold text-secondary-900 mb-2", children: action.title }), _jsx("p", { className: "text-secondary-600 text-sm mb-4", children: action.description }), _jsxs("div", { className: "flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700", children: ["Get started", _jsx(ArrowRight, { className: "ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" })] })] }, index))) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.5 }, className: "card", children: [_jsx("h2", { className: "text-xl font-bold text-secondary-900 mb-4", children: "Getting Started" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-3 p-3 bg-primary-50 rounded-lg", children: [_jsx(Calendar, { className: "h-5 w-5 text-primary-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-secondary-900 font-medium", children: "Welcome to JobAssist!" }), _jsx("p", { className: "text-secondary-600 text-sm", children: "Start by uploading your resume to get personalized insights and recommendations." })] })] }), _jsxs("div", { className: "flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg", children: [_jsx(FileText, { className: "h-5 w-5 text-secondary-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-secondary-900 font-medium", children: "Pro Tip" }), _jsx("p", { className: "text-secondary-600 text-sm", children: "Use our resume scorer to optimize your resume before applying to jobs." })] })] })] })] })] })] }));
};
export default Dashboard;
