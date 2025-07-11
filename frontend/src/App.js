import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import ResumeScorer from './pages/ResumeScorer';
import InterviewChat from './pages/InterviewChat';
import AutofillJobs from './pages/AutofillJobs';
function App() {
    return (_jsx(AuthProvider, { children: _jsx(Router, { children: _jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignUpPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/resume-upload", element: _jsx(ProtectedRoute, { children: _jsx(ResumeUpload, {}) }) }), _jsx(Route, { path: "/resume-scorer", element: _jsx(ProtectedRoute, { children: _jsx(ResumeScorer, {}) }) }), _jsx(Route, { path: "/interview-chat", element: _jsx(ProtectedRoute, { children: _jsx(InterviewChat, {}) }) }), _jsx(Route, { path: "/autofill-jobs", element: _jsx(ProtectedRoute, { children: _jsx(AutofillJobs, {}) }) })] }), _jsx(Toaster, { position: "top-right", toastOptions: {
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                        } })] }) }) }));
}
export default App;
