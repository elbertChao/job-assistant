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
  const [jdUrl, setJdUrl] = useState<string>("")
  const [jdText, setJdText] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState<string | null>(null);
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
    if (!jdUrl) {
      toast.error("Please enter a job description URL first")
      return
    }
    setAnalyzing(true)
    setSelectedResume(resume)

    try {
      // 1) call your FastAPI scoring route
      const resp = await fetch("http://localhost:8000/api/generate/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: resume.content,
          jd_url: jdUrl
        })
      })
      if (!resp.ok) throw new Error(await resp.text())
      const { overallScore, breakdown, jdText } = await resp.json()

      // 2) update local state to render
      setOverallScore(overallScore)
      setScoreBreakdown(breakdown)
      setResumeText(resume.content)
      setJdText(jdText)

      // 3) persist score back into Supabase
      const { error } = await supabase
        .from("resumes")
        .update({ score: overallScore })
        .eq("id", resume.id)
      if (error) throw error

      toast.success("✅ Resume analysis complete!")
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to analyze resume")
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

  // ——— Download Report Handler ———
  const handleDownloadReport = () => {
    if (!selectedResume) return

    const lines: string[] = []
    lines.push(`Job Description URL: ${jdUrl}`)
    lines.push(``)
    lines.push(`--- Extracted Job Description ---`)
    lines.push(jdText || "")
    lines.push(``)
    lines.push(`--- Resume Content (${selectedResume.title}) ---`)
    lines.push(resumeText || selectedResume.content)
    lines.push(``)
    lines.push(`Overall Score: ${overallScore}%`)
    lines.push(``)
    lines.push(`--- Breakdown ---`)
    scoreBreakdown.forEach(item => {
      lines.push(`${item.category}: ${item.score}/${item.maxScore}`)
      lines.push(`  Feedback: ${item.feedback}`)
      if (item.suggestions.length) {
        lines.push(`  Suggestions:`)
        item.suggestions.forEach(s => lines.push(`    • ${s}`))
      }
      lines.push(``)
    })

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedResume.title.replace(/\s+/g, "_")}_report.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // ——— Analyze Another Resume Handler ———
  const handleAnalyzeAnother = () => {
    setSelectedResume(null)
    setScoreBreakdown([])
    setOverallScore(0)
    setJdUrl("")
    setJdText(null)
    setResumeText(null)
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
                <div className="mb-4">
                  <input
                    type="url"
                    placeholder="Enter job description URL"
                    value={jdUrl}
                    onChange={e => setJdUrl(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
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

                  {/* JD + Resume Content Display */}
                  <div className="card">
                    <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                      Job Description Extracted
                    </h3>
                    <div className="bg-secondary-50 text-sm text-secondary-800 p-4 rounded max-h-60 overflow-y-scroll whitespace-pre-wrap border border-secondary-200">
                      {jdText || "No job description text extracted."}
                    </div>

                    <h3 className="text-xl font-semibold text-secondary-900 mb-4 mt-6">
                      Resume Content Used
                    </h3>
                    <div className="bg-secondary-50 text-sm text-secondary-800 p-4 rounded max-h-60 overflow-y-scroll whitespace-pre-wrap border border-secondary-200">
                      {resumeText || "No resume content available."}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleDownloadReport}
                      className="btn-primary"
                      disabled={!selectedResume}
                    >
                      Download Report
                    </button>
                    <button
                      onClick={handleAnalyzeAnother}
                      className="btn-secondary"
                    >
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