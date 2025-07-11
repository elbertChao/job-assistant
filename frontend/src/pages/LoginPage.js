import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await signIn(data.email, data.password);
            navigate('/dashboard');
        }
        catch (error) {
            // Error is handled in the auth context
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "max-w-md w-full space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsxs(Link, { to: "/", className: "flex items-center justify-center space-x-2 mb-8", children: [_jsx(Briefcase, { className: "h-10 w-10 text-primary-600" }), _jsx("span", { className: "text-2xl font-bold text-secondary-900", children: "JobAssist" })] }), _jsx("h2", { className: "text-3xl font-bold text-secondary-900", children: "Welcome back" }), _jsx("p", { className: "mt-2 text-secondary-600", children: "Sign in to your account to continue your job search" })] }), _jsxs("div", { className: "card", children: [_jsxs("form", { className: "space-y-6", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-secondary-700 mb-2", children: "Email address" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-secondary-400" }) }), _jsx("input", { ...register('email'), type: "email", className: "input-field pl-10", placeholder: "Enter your email" })] }), errors.email && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-secondary-700 mb-2", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-secondary-400" }) }), _jsx("input", { ...register('password'), type: "password", className: "input-field pl-10", placeholder: "Enter your password" })] }), errors.password && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.password.message }))] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? 'Signing in...' : 'Sign in' })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: "text-secondary-600", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/signup", className: "text-primary-600 hover:text-primary-700 font-medium", children: "Sign up here" })] }) })] })] }) }));
};
export default LoginPage;
