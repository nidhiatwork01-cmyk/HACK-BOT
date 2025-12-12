import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = true, gradient = false, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      className={`
        ${gradient ? 'bg-gradient-to-br from-white to-blue-50/50' : 'glass'} 
        rounded-2xl p-6 shadow-lg 
        ${hover ? 'card-hover' : ''} 
        border border-gray-100/50
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card

