import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import Dashboard from './pages/Dashboard'
import ResumeUpload from './pages/ResumeUpload'
import ResumeScorer from './pages/ResumeScorer'
import InterviewChat from './pages/InterviewChat'
import AutofillJobs from './pages/AutofillJobs'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/resume-upload" element={
              <ProtectedRoute>
                <ResumeUpload />
              </ProtectedRoute>
            } />
            <Route path="/resume-scorer" element={
              <ProtectedRoute>
                <ResumeScorer />
              </ProtectedRoute>
            } />
            <Route path="/interview-chat" element={
              <ProtectedRoute>
                <InterviewChat />
              </ProtectedRoute>
            } />
            <Route path="/autofill-jobs" element={
              <ProtectedRoute>
                <AutofillJobs />
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App