import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-lightGreen-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.8
          }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-primary-600 via-lightGreen-600 to-primary-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
        </motion.div>

        {/* Animated Robot/Icon */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="mb-8"
        >
          <div className="inline-block text-8xl">
            🤖
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            The page you're looking for seems to have wandered off campus.
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Don't worry, even the best students get lost sometimes! 📚
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto justify-center"
          >
            <FiArrowLeft />
            <span>Go Back</span>
          </motion.button>

          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-lightGreen-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-lightGreen-700 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <FiHome />
              <span>Go Home</span>
            </motion.button>
          </Link>

          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-8 py-4 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto justify-center"
            >
              <FiShoppingBag />
              <span>Browse Products</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-primary-200 to-lightGreen-200 dark:from-primary-900 dark:to-lightGreen-900 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-lightGreen-200 to-primary-200 dark:from-lightGreen-900 dark:to-primary-900 rounded-full opacity-20 blur-xl"
        />
      </div>
    </div>
  );
};

export default NotFound;