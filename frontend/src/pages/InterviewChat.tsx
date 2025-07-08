import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, User, Bot, Lightbulb } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

type Step = 'askJobDesc' | 'askResume' | 'chat'

const InterviewChat: React.FC = () => {
  const { user } = useAuth()

  // Conversation state
  const [messages, setMessages] = useState<Message[]>([
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
  ])
  const [step, setStep] = useState<Step>('askJobDesc')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeList, setResumeList] = useState<{ id: string; title: string; content:string }[]>([])
  const [selectedResume, setSelectedResume] = useState<{ id: string; title: string; content:string } | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
  ]

  // Helpers to append messages
  const addBotMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content,
      sender: 'bot',
      timestamp: new Date()
    }])
  }
  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: (Date.now()+1).toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    }])
  }

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Fetch resumes when it's time
  useEffect(() => {
  if (step === 'askResume' && user?.id) {
    fetch(`http://localhost:8000/api/resumes?user_id=${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        console.log("RESUMES RAW:", data)
        setResumeList(data)
      })
      .catch(err => {
        console.error("couldn't load resumes:", err)
      })
  }
}, [step, user])

  // Handle Enter in textarea
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (step === 'askJobDesc') submitJobDescription()
      else if (step === 'chat') sendMessage()
    }
  }

  // Submit job description
  const submitJobDescription = () => {
    if (!jobDescription.trim()) return
    addUserMessage(jobDescription)
    setStep('askResume')
    addBotMessage('Got it! Now select which resume to use for practice:')
  }

  // Resume selection
  const handleResumeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    const resume = resumeList.find(r => r.id === id)
    if (!resume) return
    setSelectedResume(resume)
    addUserMessage(`Selected resume: ${resume.title}`)
    setStep('chat')
    addBotMessage(`Great! We'll use "${resume.title}" and your job description. Ask me any common interview question to begin.`)
  }

  // Send chat message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return
    if (!user) {
      addBotMessage("You must be logged in to send a message.")
      return
    }
    const question = inputMessage
    addUserMessage(question)
    setInputMessage('')
    setIsTyping(true)

    try {
      const res = await fetch(`http://localhost:8000/api/generate/answer`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          user_id: user.id,
          question,
          job_description: jobDescription,
          resume_id: selectedResume?.id,
          resume_content:  selectedResume?.content,
        })
      })
      const data = await res.json()
      addBotMessage(data.answer)
    } catch (err) {
      console.error(err)
      addBotMessage("Sorry, I couldn't generate a response.")
    } finally {
      setIsTyping(false)
    }
  }

  const startNewSession = () => window.location.reload()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">Interview Practice</h1>
              <p className="text-secondary-600">
                Practice common interview questions with our AI coach and get personalized feedback.
              </p>
            </div>
            <button onClick={startNewSession} className="btn-secondary">New Session</button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <div className="card h-[600px] flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(m => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[80%] ${m.sender==='user'?'flex-row-reverse space-x-reverse':''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.sender==='user'?'bg-primary-600':'bg-secondary-600'}`}>
                          {m.sender==='user'
                            ? <User className="h-4 w-4 text-white" />
                            : <Bot  className="h-4 w-4 text-white" />}
                        </div>
                        <div className={`rounded-lg p-3 ${m.sender==='user'?'bg-primary-600 text-white':'bg-secondary-100 text-secondary-900'}`}>
                          <div className="prose prose-sm">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {m.content}
                            </ReactMarkdown>
                          </div>
                          <p className={`text-xs mt-2 ${m.sender==='user'?'text-primary-100':'text-secondary-500'}`}>
                            {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                            <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input / Steps */}
                <div className="border-t border-secondary-200 p-4">
                  {step === 'askJobDesc' && (
                    <div className="flex flex-col space-y-2">
                      <textarea
                        value={jobDescription}
                        onChange={e => setJobDescription(e.target.value)}
                        placeholder="Paste job description here..."
                        rows={4}
                        className="w-full resize-none border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button onClick={submitJobDescription} className="btn-primary w-32 self-end">
                        Submit
                      </button>
                    </div>
                  )}
                  {step === 'askResume' && (
                    <div className="flex flex-col space-y-2">
                      <select
                        value={selectedResume?.id || ''}
                        onChange={handleResumeSelect}
                        className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">-- Select a resume --</option>
                        {resumeList.map(r => (
                          <option key={r.id} value={r.id}>{r.title}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {step === 'chat' && (
                    <div className="flex space-x-3">
                      <textarea
                        value={inputMessage}
                        onChange={e => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your question here..."
                        rows={2}
                        className="flex-1 resize-none border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tips Sidebar */}
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
