import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const ResumeUpload: React.FC = () => {
  const { user } = useAuth()
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState('')

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    console.log("⏩ handleFile started")

    if (!user) {
      toast.error("You must be signed in to upload")
      return
    }

    setUploading(true)
    console.log("Uploading → true")

    // 1️⃣ Refresh the session (this will give you a new access_token)
    const {
      data: { session: refreshedSession },
      error: refreshError
    } = await supabase.auth.refreshSession()

    if (refreshError || !refreshedSession?.access_token) {
      console.error("Session refresh failed", refreshError)
      toast.error("Session refresh failed—please log in again.")
      setUploading(false)
      return
    }

    const token = refreshedSession.access_token
    console.log("Refreshed token:", token.slice(0,10), "…")

    // 2️⃣ Build the form payload
    const form = new FormData()
    form.append("file", file)

    // 3️⃣ POST to your backend
    try {
      console.log("→ About to fetch /api/resume/upload")
      const res = await fetch("http://localhost:8000/api/resume/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      })

      console.log("← Fetch returned status", res.status)

      if (!res.ok) {
        const errText = await res.text()
        console.error("Fetch not ok:", errText)
        throw new Error(`Upload failed (${res.status}): ${errText}`)
      }

      const json = await res.json()
      console.log("✅ Upload succeeded:", json)
      
      // only now flip into “file uploaded” UI
      setUploadedFile(file)
      setExtractedText(json.content || `Saved ${json.title} (ID: ${json.id})`)
      toast.success("Resume uploaded and extracted!")
    } catch (err: any) {
      console.error("🚨 Error uploading resume:", err)
      toast.error(err.message || "Failed to upload resume")
      setUploadedFile(null)
      setExtractedText("")
    } finally {
      console.log("🔚 handleFile finally; Uploading → false")
      setUploading(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setExtractedText('')
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
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Upload Your Resume</h1>
          <p className="text-secondary-600 mb-8">
            Upload your resume to get started with AI-powered analysis and job application assistance.
          </p>

          {!uploadedFile ? (
            <div className="card">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-300 ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-secondary-300 hover:border-primary-400 hover:bg-primary-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className={`mx-auto h-16 w-16 mb-4 ${dragActive ? 'text-primary-600' : 'text-secondary-400'}`} />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Drop your resume here, or click to browse
                </h3>
                <p className="text-secondary-600 mb-6">
                  Supports PDF, Word documents, and text files up to 10MB
                </p>
                <input
                  type="file"
                  id="resume-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleChange}
                  disabled={uploading}
                />
                <label
                  htmlFor="resume-upload"
                  className="btn-primary cursor-pointer inline-block"
                >
                  {uploading ? 'Uploading...' : 'Choose File'}
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Uploaded File Info */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {uploadedFile.name}
                      </h3>
                      <p className="text-secondary-600 text-sm">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded successfully
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Extracted Content Preview */}
              {extractedText && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Extracted Content Preview
                  </h3>
                  <div className="bg-secondary-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-secondary-700 whitespace-pre-wrap font-mono">
                      {extractedText.substring(0, 1000)}
                      {extractedText.length > 1000 && '...'}
                    </pre>
                  </div>
                  <div className="mt-4 flex space-x-4">
                    <button className="btn-primary">
                      Analyze Resume
                    </button>
                    <button className="btn-secondary">
                      Edit Content
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-8 card bg-primary-50 border-primary-200">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              Tips for Better Results
            </h3>
            <ul className="space-y-2 text-primary-800">
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Use a clean, well-formatted resume for better text extraction</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Include relevant keywords for your target industry</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Make sure your contact information is clearly visible</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>PDF format typically provides the best results</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResumeUpload