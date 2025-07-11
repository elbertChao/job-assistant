import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, Lightbulb } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const InterviewChat = () => {
    const { user } = useAuth();
    // Conversation state
    const [messages, setMessages] = useState([
        {
            id: '1',
            content: "Hello! I'm your AI interview coach. I'll help you practice common interview questions based on your resume and experience.",
            sender: 'bot',
            timestamp: new Date()
        },
        {
            id: '2',
            content: 'Please paste the job description for the role you want to practice for:',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [step, setStep] = useState('askJobDesc');
    const [jobDescription, setJobDescription] = useState('');
    const [resumeList, setResumeList] = useState([]);
    const [selectedResume, setSelectedResume] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    // Common questions for sidebar
    const interviewQuestions = [
        "Can you tell me about yourself?",
        "What are your greatest strengths?",
        "What is your biggest weakness?",
        "Why do you want to work here?",
        "Where do you see yourself in 5 years?",
        "Why are you leaving your current job?",
        "Describe a challenging situation you faced at work and how you handled it.",
        "What motivates you?",
        "How do you handle stress and pressure?",
        "Do you have any questions for us?"
    ];
    // Helpers to append messages
    const addBotMessage = (content) => {
        setMessages(prev => [...prev, {
                id: Date.now().toString(),
                content,
                sender: 'bot',
                timestamp: new Date()
            }]);
    };
    const addUserMessage = (content) => {
        setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                content,
                sender: 'user',
                timestamp: new Date()
            }]);
    };
    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    // Fetch resumes when it's time
    useEffect(() => {
        if (step === 'askResume' && user?.id) {
            fetch(`${import.meta.env.VITE_API_URL}/resumes?user_id=${user.id}`)
                .then(res => {
                if (!res.ok)
                    throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
                .then(data => {
                console.log("RESUMES RAW:", data);
                setResumeList(data);
            })
                .catch(err => {
                console.error("couldn't load resumes:", err);
            });
        }
    }, [step, user]);
    // Handle Enter in textarea
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (step === 'askJobDesc')
                submitJobDescription();
            else if (step === 'chat')
                sendMessage();
        }
    };
    // Submit job description
    const submitJobDescription = () => {
        if (!jobDescription.trim())
            return;
        addUserMessage(jobDescription);
        setStep('askResume');
        addBotMessage('Got it! Now select which resume to use for practice:');
    };
    // Resume selection
    const handleResumeSelect = (e) => {
        const id = e.target.value;
        const resume = resumeList.find(r => r.id === id);
        if (!resume)
            return;
        setSelectedResume(resume);
        addUserMessage(`Selected resume: ${resume.title}`);
        setStep('chat');
        addBotMessage(`Great! We'll use "${resume.title}" and your job description. Ask me any common interview question to begin.`);
    };
    // Send chat message
    const sendMessage = async () => {
        if (!inputMessage.trim())
            return;
        if (!user) {
            addBotMessage("You must be logged in to send a message.");
            return;
        }
        const question = inputMessage;
        addUserMessage(question);
        setInputMessage('');
        setIsTyping(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/generate/answer`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({
                    user_id: user.id,
                    question,
                    job_description: jobDescription,
                    resume_id: selectedResume?.id,
                    resume_content: selectedResume?.content,
                })
            });
            const data = await res.json();
            addBotMessage(data.answer);
        }
        catch (err) {
            console.error(err);
            addBotMessage("Sorry, I couldn't generate a response.");
        }
        finally {
            setIsTyping(false);
        }
    };
    const startNewSession = () => window.location.reload();
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, {}), _jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-secondary-900 mb-2", children: "Interview Practice" }), _jsx("p", { className: "text-secondary-600", children: "Practice common interview questions with our AI coach and get personalized feedback." })] }), _jsx("button", { onClick: startNewSession, className: "btn-secondary", children: "New Session" })] }), _jsxs("div", { className: "grid lg:grid-cols-4 gap-8", children: [_jsx("div", { className: "lg:col-span-3", children: _jsxs("div", { className: "card h-[600px] flex flex-col", children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.map(m => (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: `flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `flex items-start space-x-3 max-w-[80%] ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`, children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center ${m.sender === 'user' ? 'bg-primary-600' : 'bg-secondary-600'}`, children: m.sender === 'user'
                                                                        ? _jsx(User, { className: "h-4 w-4 text-white" })
                                                                        : _jsx(Bot, { className: "h-4 w-4 text-white" }) }), _jsxs("div", { className: `rounded-lg p-3 ${m.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-900'}`, children: [_jsx("div", { className: "prose prose-sm", children: _jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], children: m.content }) }), _jsx("p", { className: `text-xs mt-2 ${m.sender === 'user' ? 'text-primary-100' : 'text-secondary-500'}`, children: m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })] })] }) }, m.id))), isTyping && (_jsx("div", { className: "flex justify-start", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-secondary-600 rounded-full flex items-center justify-center", children: _jsx(Bot, { className: "h-4 w-4 text-white" }) }), _jsx("div", { className: "bg-secondary-100 rounded-lg p-3", children: _jsxs("div", { className: "flex space-x-1", children: [_jsx("div", { className: "w-2 h-2 bg-secondary-400 rounded-full animate-bounce" }), _jsx("div", { className: "w-2 h-2 bg-secondary-400 rounded-full animate-bounce", style: { animationDelay: '0.1s' } }), _jsx("div", { className: "w-2 h-2 bg-secondary-400 rounded-full animate-bounce", style: { animationDelay: '0.2s' } })] }) })] }) })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "border-t border-secondary-200 p-4", children: [step === 'askJobDesc' && (_jsxs("div", { className: "flex flex-col space-y-2", children: [_jsx("textarea", { value: jobDescription, onChange: e => setJobDescription(e.target.value), placeholder: "Paste job description here...", rows: 4, className: "w-full resize-none border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" }), _jsx("button", { onClick: submitJobDescription, className: "btn-primary w-32 self-end", children: "Submit" })] })), step === 'askResume' && (_jsx("div", { className: "flex flex-col space-y-2", children: _jsxs("select", { value: selectedResume?.id || '', onChange: handleResumeSelect, className: "w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "-- Select a resume --" }), resumeList.map(r => (_jsx("option", { value: r.id, children: r.title }, r.id)))] }) })), step === 'chat' && (_jsxs("div", { className: "flex space-x-3", children: [_jsx("textarea", { value: inputMessage, onChange: e => setInputMessage(e.target.value), onKeyPress: handleKeyPress, placeholder: "Type your question here...", rows: 2, className: "flex-1 resize-none border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" }), _jsx("button", { onClick: sendMessage, disabled: !inputMessage.trim() || isTyping, className: "btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed", children: _jsx(Send, { className: "h-4 w-4" }) })] }))] })] }) }), _jsx("div", { className: "col-span-full mt-8 card", children: _jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "card lg:col-span-4", children: [_jsxs("h3", { className: "text-lg font-semibold text-secondary-900 mb-4 flex items-center", children: [_jsx(Lightbulb, { className: "h-5 w-5 mr-2 text-yellow-500" }), "Interview Tips"] }), _jsxs("div", { className: "grid grid-cols-2 gap-x-8 gap-y-6 text-sm items-start", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "px-4 py-3 bg-primary-50 rounded-lg", children: [_jsx("h4", { className: "font-medium text-primary-900 mb-1", children: "STAR Method" }), _jsx("p", { className: "text-primary-700", children: "Structure your answers: Situation, Task, Action, Result" })] }), _jsxs("div", { className: "px-4 py-3 bg-primary-50 rounded-lg", children: [_jsx("h4", { className: "font-medium text-green-900 mb-1", children: "Be Specific" }), _jsx("p", { className: "text-green-700", children: "Use concrete examples and quantify your achievements" })] }), _jsxs("div", { className: "px-4 py-3 bg-primary-50 rounded-lg", children: [_jsx("h4", { className: "font-medium text-blue-900 mb-1", children: "Stay Positive" }), _jsx("p", { className: "text-blue-700", children: "Frame challenges as learning opportunities" })] }), _jsxs("div", { className: "px-4 py-3 bg-primary-50 rounded-lg", children: [_jsx("h4", { className: "font-medium text-purple-900 mb-1", children: "Ask Questions" }), _jsx("p", { className: "text-purple-700", children: "Show interest by asking thoughtful questions" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-secondary-900 mb-4", children: "Common Questions" }), _jsx("div", { className: 'space-y-3', children: interviewQuestions.slice(0, 5).map((question, index) => (_jsx("div", { className: "px-3 py-2 bg-secondary-50 rounded-lg text-secondary-700", children: question }, index))) })] })] })] }) }) })] })] }) })] }));
};
export default InterviewChat;
