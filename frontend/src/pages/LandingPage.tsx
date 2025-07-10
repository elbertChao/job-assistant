import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Target, 
  Users, 
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import Navbar from '../components/Navbar'

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: 'Smart Resume Analysis',
      description: 'Get detailed feedback and scoring on your resume to improve your chances of landing interviews.'
    },
    {
      icon: Target,
      title: 'Job Application Autofill',
      description: 'Automatically fill job applications using your resume data, saving hours of repetitive work.'
    },
    {
      icon: MessageSquare,
      title: 'Interview Practice',
      description: 'Practice with our AI chatbot that asks common interview questions based on your resume.'
    },
    {
      icon: TrendingUp,
      title: 'Application Tracking',
      description: 'Keep track of all your job applications in one organized dashboard.'
    }
  ]

  const benefits = [
    'Save 10+ hours per week on job applications',
    'Increase interview callback rate by 40%',
    'Get personalized resume improvement suggestions',
    'Practice interviews with AI-powered feedback',
    'Track application status and follow-ups'
  ]

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6">
              Land Your Dream Job
              <span className="text-primary-600 block">Faster & Smarter</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered job assistant that helps you optimize your resume, practice interviews, 
              and automate job applications. Get hired 3x faster with personalized insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Everything You Need to Get Hired
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Our comprehensive suite of tools helps you at every step of your job search journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-secondary-900 mb-6">
                Why Choose JobAssist?
              </h2>
              <p className="text-xl text-secondary-600 mb-8">
                Join thousands of job seekers who have successfully landed their dream jobs 
                using our AI-powered platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-secondary-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">Success Stories</h3>
                    <p className="text-secondary-600">Real results from real users</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-primary-50 rounded-lg p-4">
                    <p className="text-secondary-700 italic mb-2">
                      "JobAssist helped me land 3 interviews in my first week. The resume scorer 
                      was a game-changer!"
                    </p>
                    <p className="text-sm text-secondary-600">- Sarah M., Software Engineer</p>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <p className="text-secondary-700 italic mb-2">
                      "The autofill feature saved me hours of repetitive work. Highly recommend!"
                    </p>
                    <p className="text-sm text-secondary-600">- Mike R., Marketing Manager</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Accelerate Your Job Search?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of successful job seekers and start landing interviews today.
            </p>
            <Link
              to="/signup"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 inline-flex items-center text-lg"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src="/logo.png" alt="JobAssist Logo" className="w-10 h-10" />
              <span className="text-xl font-bold">JobAssist</span>
            </div>
            <p className="text-secondary-400 text-center md:text-right">
              © 2025 JobAssist. All rights reserved. Built by Elbert Chao for job seekers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage