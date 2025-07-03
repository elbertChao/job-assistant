import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, ExternalLink, Calendar, Building, MapPin, DollarSign, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface JobApplication {
  id: string
  company_name: string
  position: string
  job_url: string | null
  status: string
  applied_date: string | null
  notes: string | null
  created_at: string
}

const AutofillJobs: React.FC = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    company_name: '',
    position: '',
    job_url: '',
    status: 'applied',
    applied_date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  useEffect(() => {
    fetchApplications()
  }, [user])

  const fetchApplications = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('Failed to load job applications')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          ...formData
        })

      if (error) throw error

      toast.success('Job application added successfully!')
      setShowAddForm(false)
      setFormData({
        company_name: '',
        position: '',
        job_url: '',
        status: 'applied',
        applied_date: new Date().toISOString().split('T')[0],
        notes: ''
      })
      fetchApplications()
    } catch (error) {
      console.error('Error adding application:', error)
      toast.error('Failed to add job application')
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      toast.success('Status updated successfully!')
      fetchApplications()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800'
      case 'interview': return 'bg-yellow-100 text-yellow-800'
      case 'offer': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const autofillDemo = () => {
    // Simulate autofill functionality
    setFormData({
      company_name: 'TechCorp Inc.',
      position: 'Senior Software Engineer',
      job_url: 'https://example.com/job/12345',
      status: 'applied',
      applied_date: new Date().toISOString().split('T')[0],
      notes: 'Auto-filled from resume data: 5+ years React experience, Full-stack development, Team leadership'
    })
    toast.success('Form auto-filled with your resume data!')
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">Job Applications</h1>
              <p className="text-secondary-600">
                Track your job applications and use autofill to speed up the application process.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Application</span>
            </button>
          </div>

          {/* Autofill Demo Section */}
          <div className="card mb-8 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  🚀 Smart Autofill Feature
                </h3>
                <p className="text-primary-700 mb-4">
                  Save time by automatically filling job applications with your resume data. 
                  Our AI extracts relevant information and populates forms instantly.
                </p>
                <div className="flex space-x-4 text-sm text-primary-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Save 10+ minutes per application</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Increase application volume by 300%</span>
                  </div>
                </div>
              </div>
              <button
                onClick={autofillDemo}
                className="btn-primary"
              >
                Try Autofill Demo
              </button>
            </div>
          </div>

          {/* Add Application Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card mb-8"
            >
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">Add New Application</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="input-field"
                      placeholder="Enter company name"
                      autoComplete='organization-name'
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Position *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="input-field"
                      placeholder="Enter position title"
                      autoComplete='job-title'
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Job URL
                    </label>
                    <input
                      type="url"
                      value={formData.job_url}
                      onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                      className="input-field"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Applied Date
                    </label>
                    <input
                      type="date"
                      value={formData.applied_date}
                      onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Add any notes about this application..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">
                    Add Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Applications List */}
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="card text-center py-12">
                <Building className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  No Applications Yet
                </h3>
                <p className="text-secondary-600 mb-6">
                  Start tracking your job applications to stay organized and increase your success rate.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary"
                >
                  Add Your First Application
                </button>
              </div>
            ) : (
              applications.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="card hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {app.position}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-secondary-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span>{app.company_name}</span>
                        </div>
                        {app.applied_date && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(app.applied_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {app.notes && (
                        <p className="text-secondary-600 text-sm mb-3">{app.notes}</p>
                      )}

                      <div className="flex items-center space-x-4">
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value)}
                          className="text-sm border border-secondary-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="applied">Applied</option>
                          <option value="interview">Interview</option>
                          <option value="offer">Offer</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        
                        {app.job_url && (
                          <a
                            href={app.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>View Job</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AutofillJobs