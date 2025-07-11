import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createUser } from '../services/api';
const signUpSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});
const SignUpPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(signUpSchema),
    });
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await signUp(data.email, data.password, data.fullName);
            console.log("User signed up, creating backend profile...");
            const userProfile = await createUser(data.fullName);
            console.log("🧪 createUser() result:", userProfile);
            if (!userProfile) {
                console.error("❌ createUser() returned null — aborting navigation");
                return;
            }
            console.log("✅ Navigation triggered to /dashboard");
            navigate('/dashboard');
        }
        catch (err) {
            console.error("❌ Sign-up failed:", err);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "max-w-md w-full space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsxs(Link, { to: "/", className: "flex items-center justify-center space-x-2 mb-8", children: [_jsx(Briefcase, { className: "h-10 w-10 text-primary-600" }), _jsx("span", { className: "text-2xl font-bold text-secondary-900", children: "JobAssist" })] }), _jsx("h2", { className: "text-3xl font-bold text-secondary-900", children: "Create your account" }), _jsx("p", { className: "mt-2 text-secondary-600", children: "Start your journey to landing your dream job" })] }), _jsxs("div", { className: "card", children: [_jsxs("form", { className: "space-y-6", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "fullName", className: "block text-sm font-medium text-secondary-700 mb-2", children: "Full name" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(User, { className: "h-5 w-5 text-secondary-400" }) }), _jsx("input", { ...register('fullName'), type: "text", className: "input-field pl-10", placeholder: "Enter your full name", autoComplete: 'name' })] }), errors.fullName && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.fullName.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-secondary-700 mb-2", children: "Email address" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-secondary-400" }) }), _jsx("input", { ...register('email'), type: "email", className: "input-field pl-10", placeholder: "Enter your email" })] }), errors.email && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-secondary-700 mb-2", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-secondary-400" }) }), _jsx("input", { ...register('password'), type: "password", className: "input-field pl-10", placeholder: "Create a password" })] }), errors.password && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.password.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-secondary-700 mb-2", children: "Confirm password" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-secondary-400" }) }), _jsx("input", { ...register('confirmPassword'), type: "password", className: "input-field pl-10", placeholder: "Confirm your password" })] }), errors.confirmPassword && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.confirmPassword.message }))] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? 'Creating account...' : 'Create account' })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: "text-secondary-600", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "text-primary-600 hover:text-primary-700 font-medium", children: "Sign in here" })] }) })] })] }) }));
};
export default SignUpPage;
