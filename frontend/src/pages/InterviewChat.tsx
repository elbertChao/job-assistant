import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, MessageSquare, User, Bot, Lightbulb } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm   from 'remark-gfm'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const InterviewChat: React.FC = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI interview coach. I'll help you practice common interview questions based on your resume and experience. Let's start with a simple question: Can you tell me about yourself?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8000/api/generate/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id || "anonymous",
          question: inputMessage,
          job_description: "" // add job description here if needed
        }),
      });

      const data = await res.json();

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I couldn't generate a response at the moment.",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const startNewSession = () => {
    setMessages([
      {
        id: '1',
        content: "Great! Let's start a fresh interview practice session. I'll ask you different questions this time. Here's your first question: What interests you most about this position?",
        sender: 'bot',
        timestamp: new Date()
      }
    ])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">Interview Practice</h1>
              <p className="text-secondary-600">
                Practice common interview questions with our AI coach and get personalized feedback.
              </p>
            </div>
            <button
              onClick={startNewSession}
              className="btn-secondary"
            >
              New Session
            </button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <div className="card h-[600px] flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-primary-600' 
                            : 'bg-secondary-600'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-secondary-100 text-secondary-900'
                        }`}>
                          <div className="prose prose-sm">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                          <p className={`text-xs mt-2 ${
                            message.sender === 'user' 
                              ? 'text-primary-100' 
                              : 'text-secondary-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-secondary-600 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-secondary-100 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-secondary-200 p-4">
                  <div className="flex space-x-3">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your answer here..."
                      className="flex-1 resize-none border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={2}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-full mt-8 card">
              {/* Tips Sidebar */}
              <div className="lg:col-span-1">
                <div className="card lg:col-span-4">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                    Interview Tips
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm items-start">
                    {/* LEFT COLUMN: your existing 4 tips */}
                    <div className="space-y-4">
                      <div className="px-4 py-3 bg-primary-50 rounded-lg">
                        <h4 className="font-medium text-primary-900 mb-1">STAR Method</h4>
                        <p className="text-primary-700">Structure your answers: Situation, Task, Action, Result</p>
                      </div>
                      <div className="px-4 py-3 bg-primary-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-1">Be Specific</h4>
                        <p className="text-green-700">Use concrete examples and quantify your achievements</p>
                      </div>
                      <div className="px-4 py-3 bg-primary-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-1">Stay Positive</h4>
                        <p className="text-blue-700">Frame challenges as learning opportunities</p>
                      </div>
                      <div className="px-4 py-3 bg-primary-50 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-1">Ask Questions</h4>
                        <p className="text-purple-700">Show interest by asking thoughtful questions</p>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: pull in Common Questions */}
                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-4">Common Questions</h4>
                      <div className='space-y-3'>
                        {interviewQuestions.slice(0, 5).map((question, index) => (
                          <div key={index} className="px-3 py-2 bg-secondary-50 rounded-lg text-secondary-700">
                            {question}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default InterviewChat