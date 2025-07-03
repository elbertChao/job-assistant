import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, TrendingUp, AlertCircle, CheckCircle, FileText } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface Resume {
  id: string
  title: string
  content: string
  score: number | null
  created_at: string
}

interface ScoreBreakdown {
  category: string
  score: number
  maxScore: number
  feedback: string
  suggestions: string[]
}

const ResumeScorer: React.FC = () => {
  const { user } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown[]>([])
  const [overallScore, setOverallScore] = useState(0)

  useEffect(() => {
    fetchResumes()
  }, [user])

  const fetchResumes = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setResumes(data || [])
    } catch (error) {
      console.error('Error fetching resumes:', error)
      toast.error('Failed to load resumes')
    }
  }

  const analyzeResume = async (resume: Resume) => {
    setAnalyzing(true)
    setSelectedResume(resume)

    try {
      // Simulate AI analysis - in a real app, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000))

      const mockScoreBreakdown: ScoreBreakdown[] = [
        {
          category: 'Contact Information',
          score: 9,
          maxScore: 10,
          feedback: 'Complete contact information provided',
          suggestions: ['Consider adding LinkedIn profile URL']
        },
        {
          category: 'Professional Summary',
          score: 7,
          maxScore: 10,
          feedback: 'Good summary but could be more impactful',
          suggestions: [
            'Include specific achievements with numbers',
            'Highlight unique value proposition',
            'Tailor to target role'
          ]
        },
        {
          category: 'Work Experience',
          score: 8,
          maxScore: 10,
          feedback: 'Strong experience section with good details',
          suggestions: [
            'Use more action verbs',
            'Quantify achievements where possible'
          ]
        },
        {
          category: 'Skills',
          score: 6,
          maxScore: 10,
          feedback: 'Skills section needs improvement',
          suggestions: [
            'Add more relevant technical skills',
            'Include soft skills',
            'Organize skills by category'
          ]
        },
        {
          category: 'Education',
          score: 8,
          maxScore: 10,
          feedback: 'Education section is well-formatted',
          suggestions: ['Include relevant coursework or projects']
        },
        {
          category: 'Formatting & ATS Compatibility',
          score: 7,
          maxScore: 10,
          feedback: 'Good formatting but some ATS optimization needed',
          suggestions: [
            'Use standard section headings',
            'Avoid complex formatting',
            'Include relevant keywords'
          ]
        }
      ]

      const totalScore = mockScoreBreakdown.reduce((sum, item) => sum + item.score, 0)
      const maxTotalScore = mockScoreBreakdown.reduce((sum, item) => sum + item.maxScore, 0)
      const overallPercentage = Math.round((totalScore / maxTotalScore) * 100)

      setScoreBreakdown(mockScoreBreakdown)
      setOverallScore(overallPercentage)

      // Update resume score in database
      const { error } = await supabase
        .from('resumes')
        .update({ score: overallPercentage })
        .eq('id', resume.id)

      if (error) throw error

      toast.success('Resume analysis completed!')
    } catch (error) {
      console.error('Error analyzing resume:', error)
      toast.error('Failed to analyze resume')
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Resume Scorer</h1>
          <p className="text-secondary-600 mb-8">
            Get detailed feedback and scoring on your resume to improve your chances of landing interviews.
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Resume Selection */}
            <div className="lg:col-span-1">
              <div className="card">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">Your Resumes</h2>
                {resumes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600 mb-4">No resumes uploaded yet</p>
                    <button className="btn-primary">
                      Upload Resume
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {resumes.map((resume) => (
                      <div
                        key={resume.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedResume?.id === resume.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-secondary-200 hover:border-primary-300 hover:bg-primary-25'
                        }`}
                        onClick={() => analyzeResume(resume)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-secondary-900 truncate">
                              {resume.title}
                            </h3>
                            <p className="text-sm text-secondary-600">
                              {new Date(resume.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {resume.score && (
                            <div className={`px-2 py-1 rounded text-sm font-medium ${getScoreBgColor(resume.score)} ${getScoreColor(resume.score)}`}>
                              {resume.score}%
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Results */}
            <div className="lg:col-span-2">
              {analyzing ? (
                <div className="card text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    Analyzing Your Resume
                  </h3>
                  <p className="text-secondary-600">
                    Our AI is reviewing your resume and generating detailed feedback...
                  </p>
                </div>
              ) : selectedResume && scoreBreakdown.length > 0 ? (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-secondary-900">
                        Overall Score
                      </h2>
                      <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                        {overallScore}%
                      </div>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          overallScore >= 80 ? 'bg-green-500' :
                          overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${overallScore}%` }}
                      ></div>
                    </div>
                    <p className="text-secondary-600 mt-4">
                      {overallScore >= 80 ? 'Excellent! Your resume is well-optimized.' :
                       overallScore >= 60 ? 'Good foundation with room for improvement.' :
                       'Significant improvements needed to increase your chances.'}
                    </p>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="card">
                    <h3 className="text-xl font-semibold text-secondary-900 mb-6">
                      Detailed Analysis
                    </h3>
                    <div className="space-y-6">
                      {scoreBreakdown.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="border-l-4 border-primary-500 pl-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-secondary-900">
                              {item.category}
                            </h4>
                            <span className={`font-bold ${getScoreColor((item.score / item.maxScore) * 100)}`}>
                              {item.score}/{item.maxScore}
                            </span>
                          </div>
                          <p className="text-secondary-600 mb-3">{item.feedback}</p>
                          {item.suggestions.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-secondary-700 mb-2">
                                Suggestions for improvement:
                              </p>
                              <ul className="space-y-1">
                                {item.suggestions.map((suggestion, idx) => (
                                  <li key={idx} className="flex items-start space-x-2 text-sm text-secondary-600">
                                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <span>{suggestion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button className="btn-primary">
                      Download Report
                    </button>
                    <button className="btn-secondary">
                      Analyze Another Resume
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card text-center py-12">
                  <Star className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    Select a Resume to Analyze
                  </h3>
                  <p className="text-secondary-600">
                    Choose a resume from the left panel to get detailed scoring and feedback.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResumeScorer