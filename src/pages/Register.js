import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiShoppingBag, FiEye, FiEyeOff, FiMapPin, FiCheck } from 'react-icons/fi';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phoneNumber: '',
    university: '',
    studentId: '',
    address: {
      street: '',
      city: '',
      state: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill all fields');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.phoneNumber || !formData.university) {
      toast.error('Please fill all required fields');
      return false;
    }
    if (formData.role === 'student' && !formData.studentId) {
      toast.error('Student ID is required');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setLoading(true);

    const { confirmPassword, ...dataToSend } = formData;
    const result = await register(dataToSend);
    
    if (result.success) {
      toast.success('Account created successfully! 🎉');
      navigate('/products');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const progressPercentage = (step / 2) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-lightGreen-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-lightGreen-200 dark:bg-lightGreen-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-primary-300 dark:bg-primary-800 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-4 rounded-3xl shadow-2xl">
              <FiShoppingBag className="text-white text-5xl" />
            </div>
          </motion.div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
            Join StudentMart
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Create your account in just 2 simple steps</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Step {step} of 2</span>
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{progressPercentage}% Complete</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className="h-full bg-gradient-to-r from-primary-600 to-primary-700 rounded-full"
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 backdrop-blur-xl bg-opacity-90 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700"
        >
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 w-10 h-10 rounded-full flex items-center justify-center mr-3 font-bold">1</span>
                    Basic Information
                  </h3>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      I am a:
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'student' })}
                        className={`p-5 border-2 rounded-xl transition-all duration-300 ${
                          formData.role === 'student'
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <FiUser className={`mx-auto text-3xl mb-2 ${formData.role === 'student' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`} />
                        <div className="font-bold text-gray-900 dark:text-white">Student</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Buy & Sell items</div>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'vendor' })}
                        className={`p-5 border-2 rounded-xl transition-all duration-300 ${
                          formData.role === 'vendor'
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <FiShoppingBag className={`mx-auto text-3xl mb-2 ${formData.role === 'vendor' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`} />
                        <div className="font-bold text-gray-900 dark:text-white">Vendor</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Sell products</div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <div className="relative group">
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="input-field pl-12"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <div className="relative group">
                      <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field pl-12"
                        placeholder="john@student.edu.ng"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                      <div className="relative group">
                        <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength="6"
                          className="input-field pl-12 pr-12"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
                        >
                          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                      <div className="relative group">
                        <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="input-field pl-12 pr-12"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
                        >
                          {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Next Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Continue to Step 2 →
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 w-10 h-10 rounded-full flex items-center justify-center mr-3 font-bold">2</span>
                    Contact & Location
                  </h3>

                  {/* Phone & University */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                      <div className="relative group">
                        <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                          className="input-field pl-12"
                          placeholder="08012345678"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">University</label>
                      <div className="relative group">
                        <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                        <input
                          type="text"
                          name="university"
                          value={formData.university}
                          onChange={handleChange}
                          required
                          className="input-field pl-12"
                          placeholder="University of Lagos"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Student ID (conditional) */}
                  {formData.role === 'student' && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Student ID</label>
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        required={formData.role === 'student'}
                        className="input-field"
                        placeholder="UNILAG/2023/001"
                      />
                    </div>
                  )}

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Address (Optional)</label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Street Address"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="City"
                        />
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="State"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                    >
                      ← Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <FiCheck />
                          <span>Create Account</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white dark:bg-gray-800 backdrop-blur-xl bg-opacity-90 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Secure</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Your data is protected</div>
            </div>
            <div>
              <div className="text-3xl mb-2">✓</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Verified</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Student verification</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🎓</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Free</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">No hidden charges</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;