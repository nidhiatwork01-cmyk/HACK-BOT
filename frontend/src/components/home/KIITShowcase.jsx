import { motion } from 'framer-motion'
import { Users, Calendar, Award, Globe, Music, BookOpen, Trophy, Sparkles } from 'lucide-react'
import Card from '../ui/Card'

const KIITShowcase = () => {
  const stats = [
    { icon: Calendar, value: '500+', label: 'Events Annually', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, value: '30+', label: 'Student Societies', color: 'from-purple-500 to-pink-500' },
    { icon: Globe, value: '50+', label: 'Countries Represented', color: 'from-green-500 to-emerald-500' },
    { icon: Trophy, value: '100+', label: 'Awards Won', color: 'from-orange-500 to-red-500' },
  ]

  const eventTypes = [
    { icon: Music, title: 'Cultural Festivals', desc: 'Celebrating diversity through music, dance, and art', gradient: 'from-purple-500 to-pink-500' },
    { icon: BookOpen, title: 'Academic Conferences', desc: 'Knowledge sharing and research excellence', gradient: 'from-blue-500 to-cyan-500' },
    { icon: Trophy, title: 'Sports Events', desc: 'Fostering teamwork and competitive spirit', gradient: 'from-green-500 to-emerald-500' },
    { icon: Sparkles, title: 'Tech Hackathons', desc: 'Innovation and coding challenges', gradient: 'from-orange-500 to-red-500' },
  ]

  return (
    <div className="relative py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Campus Hero Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Card className="p-0 overflow-hidden relative h-[400px] md:h-[500px] lg:h-[600px]">
            {/* Campus Image Background */}
            <div className="absolute inset-0">
              <img 
                src="/160033254_4320574607972553_8805355199961689335_o-750x430.jpg"
                alt="KIIT Campus"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src)
                  e.target.style.display = 'none'
                }}
              />
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/85 via-blue-900/75 to-purple-900/85"></div>
            </div>
              
              {/* Content overlay */}
              <div className="relative h-full flex flex-col justify-center items-center text-center p-8">
                {/* NAAC Badge - Top Left */}
                <motion.div
                  initial={{ scale: 0, x: -20 }}
                  whileInView={{ scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="absolute top-6 left-6 bg-red-600 text-white px-5 py-2.5 rounded-full font-bold text-xs md:text-sm shadow-xl z-10"
                >
                  NAAC A++ ACCREDITED
                </motion.div>

                {/* University Rankings Badge - Top Right */}
                <motion.div
                  initial={{ scale: 0, x: 20 }}
                  whileInView={{ scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="absolute top-6 right-6 bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold text-xs md:text-sm shadow-xl z-10"
                >
                  <div className="text-center">
                    <div className="text-lg font-extrabold">5th Best</div>
                    <div className="text-xs">in India</div>
                  </div>
                </motion.div>

                {/* Main Heading */}
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl"
                >
                  Innovate, Inspire, Ignite
                </motion.h2>
                
                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl font-medium drop-shadow-lg"
                >
                  - where innovation meets excellence, creating leaders for tomorrow.
                </motion.p>

                {/* KIIT Badge - Bottom */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/25 backdrop-blur-md px-8 py-4 rounded-xl border-2 border-white/40 shadow-2xl"
                >
                  <p className="text-white font-bold text-base md:text-lg">KALINGA INSTITUTE OF INDUSTRIAL TECHNOLOGY</p>
                  <p className="text-white/80 text-xs md:text-sm mt-1">Deemed to be University U/S 3 of UGC Act, 1956</p>
                </motion.div>
              </div>
          </Card>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg mb-6"
          >
            <Award className="w-5 h-5" />
            <span className="font-bold">KIIT - Deemed to be University</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Experience Campus Life
            </span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students in celebrating diversity, innovation, and excellence. 
            From cultural festivals to technical hackathons, every event shapes your journey at{' '}
            <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              KIIT
            </span>.
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card gradient className="text-center relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
                  <div className="relative">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Event Types Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="gradient-text">Explore Our Event Ecosystem</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="h-full text-center group cursor-pointer">
                    <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${type.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{type.desc}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Campus Life Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="relative overflow-hidden p-0">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 opacity-90"></div>
            <div className="relative p-12 text-center text-white">
              <h3 className="text-4xl font-extrabold mb-4">
                Campus Life at{' '}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                  KIIT
                </span>
              </h3>
              <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                Join thousands of students in celebrating diversity, innovation, and excellence. 
                From cultural festivals to technical hackathons, every event shapes your journey.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <span className="font-semibold">30+ State-of-the-Art Campuses</span>
                </div>
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <span className="font-semibold">18 Sports Complexes</span>
                </div>
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <span className="font-semibold">NAAC A++ Accredited</span>
                </div>
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <span className="font-semibold">Global Recognition</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default KIITShowcase

