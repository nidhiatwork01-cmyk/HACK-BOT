import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  disabled,
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:scale-105',
    secondary: 'bg-white text-blue-600 border-2 border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-purple-500',
    outline: 'bg-transparent text-gray-700 border-2 border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:border-blue-400',
    ghost: 'bg-transparent text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-50',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button

