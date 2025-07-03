import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FileText, 
  MessageSquare, 
  Target, 
  TrendingUp,
  Upload,
  Star,
  Calendar,
  ArrowRight
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    resumes: 0,
    applications: 0,
    averageScore: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        // Fetch resume count
        const { count: resumeCount } = await supabase
          .from('resumes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        // Fetch application count
        const { count: applicationCount } = await supabase
          .from('job_applications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        // Fetch average resume score
        const { data: resumes } = await supabase
          .from('resumes')
          .select('score')
          .eq('user_id', user.id)
          .not('score', 'is', null)

        const averageScore = resumes && resumes.length > 0
          ? resumes.reduce((sum, resume) => sum + (resume.score || 0), 0) / resumes.length
          : 0

        setStats({
          resumes: resumeCount || 0,
          applications: applicationCount || 0,
          averageScore: Math.round(averageScore)
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [user])

  const quickActions = [
    {
      title: 'Upload Resume',
      description: 'Upload and analyze your resume',
      icon: Upload,
      link: '/resume-upload',
      color: 'bg-blue-500'
    },
    {
      title: 'Score Resume',
      description: 'Get detailed feedback on your resume',
      icon: Star,
      link: '/resume-scorer',
      color: 'bg-green-500'
    },
    {
      title: 'Practice Interview',
      description: 'Chat with AI for interview prep',
      icon: MessageSquare,
      link: '/interview-chat',
      color: 'bg-purple-500'
    },
    {
      title: 'Autofill Jobs',
      description: 'Auto-fill job applications',
      icon: Target,
      link: '/autofill-jobs',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'Job Seeker'}!
          </h1>
          <p className="text-secondary-600">
            Here's your job search progress and quick actions to help you land your next role.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Resumes</p>
                <p className="text-3xl font-bold text-secondary-900">{stats.resumes}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Applications</p>
                <p className="text-3xl font-bold text-secondary-900">{stats.applications}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Avg. Resume Score</p>
                <p className="text-3xl font-bold text-secondary-900">{stats.averageScore}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="card hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-secondary-600 text-sm mb-4">
                  {action.description}
                </p>
                <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700">
                  Get started
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
              <Calendar className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-secondary-900 font-medium">Welcome to JobAssist!</p>
                <p className="text-secondary-600 text-sm">
                  Start by uploading your resume to get personalized insights and recommendations.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
              <FileText className="h-5 w-5 text-secondary-600" />
              <div>
                <p className="text-secondary-900 font-medium">Pro Tip</p>
                <p className="text-secondary-600 text-sm">
                  Use our resume scorer to optimize your resume before applying to jobs.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard