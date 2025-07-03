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

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        const content = e.target?.result as string
        
        if (file.type === 'text/plain') {
          resolve(content)
        } else if (file.type === 'application/pdf') {
          // For demo purposes, we'll simulate PDF text extraction
          // In a real app, you'd use a library like pdf-parse
          resolve(`[PDF Content] ${file.name}\n\nThis is a simulated extraction of PDF content. In a real application, this would contain the actual text from your PDF resume including your experience, skills, education, and contact information.`)
        } else if (file.type.includes('word')) {
          // For demo purposes, we'll simulate Word document text extraction
          // In a real app, you'd use a library like mammoth
          resolve(`[Word Document Content] ${file.name}\n\nThis is a simulated extraction of Word document content. In a real application, this would contain the actual text from your Word resume including your experience, skills, education, and contact information.`)
        } else {
          reject(new Error('Unsupported file type'))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  const handleFile = async (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, Word document, or text file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB')
      return
    }

    setUploading(true)
    setUploadedFile(file)

    try {
      // Extract text from file
      const text = await extractTextFromFile(file)
      setExtractedText(text)

      // Save to database
      if (user) {
        const { error } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            title: file.name,
            content: text,
            file_url: null // In a real app, you'd upload to storage first
          })

        if (error) throw error

        toast.success('Resume uploaded successfully!')
      }
    } catch (error: any) {
      console.error('Error uploading resume:', error)
      toast.error('Failed to upload resume')
      setUploadedFile(null)
      setExtractedText('')
    } finally {
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