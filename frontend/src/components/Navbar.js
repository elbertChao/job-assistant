import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, } from 'lucide-react';
const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };
    return (_jsx("nav", { className: "bg-white shadow-sm border-b border-secondary-200", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs(Link, { to: user ? "/dashboard" : "/", className: "flex items-center space-x-2", children: [_jsx("img", { src: "/logo.png", alt: "JobAssist Logo", className: "w-10 h-10" }), _jsx("span", { className: "text-xl font-bold text-secondary-900", children: "JobAssist" })] }), _jsx("div", { className: "flex items-center space-x-4", children: user ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center space-x-2 text-secondary-700", children: [_jsx(User, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm", children: user.email })] }), _jsxs("button", { onClick: handleSignOut, className: "flex items-center space-x-1 text-secondary-600 hover:text-secondary-900 transition-colors", children: [_jsx(LogOut, { className: "h-4 w-4" }), _jsx("span", { className: "text-sm", children: "Sign Out" })] })] })) : (_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Link, { to: "/login", className: "text-secondary-600 hover:text-secondary-900 transition-colors", children: "Sign In" }), _jsx(Link, { to: "/signup", className: "btn-primary", children: "Get Started" })] })) })] }) }) }));
};
export default Navbar;
