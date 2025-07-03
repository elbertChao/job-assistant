import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, MessageSquare, User, Bot, Lightbulb } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'

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

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Simple response logic - in a real app, this would use AI
    if (lowerMessage.includes('strength') || lowerMessage.includes('good at')) {
      return "That's a great strength! Can you provide a specific example of how this strength helped you succeed in a previous role? Remember to use the STAR method (Situation, Task, Action, Result) when describing your examples."
    } else if (lowerMessage.includes('weakness') || lowerMessage.includes('improve')) {
      return "Good self-awareness! The key to answering weakness questions is to show how you're actively working to improve. Can you tell me about the steps you're taking to address this weakness?"
    } else if (lowerMessage.includes('myself') || lowerMessage.includes('about me')) {
      return "Nice introduction! A strong 'tell me about yourself' answer should be concise and follow this structure: Present (current role/situation), Past (relevant experience), Future (why you're interested in this role). Would you like to try restructuring your answer using this format?"
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're welcome! Let's continue with another common question: " + interviewQuestions[Math.floor(Math.random() * interviewQuestions.length)]
    } else {
      // Generate a follow-up question or feedback
      const responses = [
        "That's a solid answer! To make it even stronger, try to include specific metrics or results. Here's another question: " + interviewQuestions[Math.floor(Math.random() * interviewQuestions.length)],
        "Good response! Remember to maintain eye contact and speak confidently during the actual interview. Let's practice another one: " + interviewQuestions[Math.floor(Math.random() * interviewQuestions.length)],
        "Nice! Your answer shows good self-reflection. For your next response, try to connect your experience more directly to the role you're applying for. Here's another question: " + interviewQuestions[Math.floor(Math.random() * interviewQuestions.length)]
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

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
                          <p className="text-sm leading-relaxed">{message.content}</p>
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

            {/* Tips Sidebar */}
            <div className="lg:col-span-1">
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                  Interview Tips
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <h4 className="font-medium text-primary-900 mb-1">STAR Method</h4>
                    <p className="text-primary-700">Structure your answers: Situation, Task, Action, Result</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-1">Be Specific</h4>
                    <p className="text-green-700">Use concrete examples and quantify your achievements</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Stay Positive</h4>
                    <p className="text-blue-700">Frame challenges as learning opportunities</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-1">Ask Questions</h4>
                    <p className="text-purple-700">Show interest by asking thoughtful questions</p>
                  </div>
                </div>
              </div>

              <div className="card mt-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Common Questions
                </h3>
                <div className="space-y-2 text-sm">
                  {interviewQuestions.slice(0, 5).map((question, index) => (
                    <div key={index} className="p-2 bg-secondary-50 rounded text-secondary-700">
                      {question}
                    </div>
                  ))}
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