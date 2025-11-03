import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, initializePayment } from '../services/api';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiCreditCard, FiLock, FiShield, FiCheck, FiPackage, FiEdit2 } from 'react-icons/fi';

const Checkout = () => {
 const { cartItems, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [notes, setNotes] = useState('');

  const handleChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value
    });
  };

  const validateStep1 = () => {
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.phoneNumber) {
      toast.error('Please fill all delivery details');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.id || item._id,
          quantity: item.quantity
        })),
        deliveryAddress,
        notes
      };

      const orderResponse = await createOrder(orderData);
      const orderId = orderResponse.data.order._id;

      const paymentResponse = await initializePayment(orderId);
      const { authorization_url } = paymentResponse.data.data;

      toast.success('Redirecting to payment...');
      window.location.href = authorization_url;

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Checkout failed');
      setLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const steps = [
    { number: 1, title: 'Delivery', icon: FiMapPin },
    { number: 2, title: 'Review', icon: FiPackage },
    { number: 3, title: 'Payment', icon: FiCreditCard }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Secure Checkout</h1>
          <p className="text-gray-600 dark:text-gray-400">Complete your order in just a few steps</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center justify-center w-16 h-16 rounded-full font-bold text-lg transition-all duration-300 ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <FiCheck className="text-2xl" />
                    ) : (
                      <step.icon className="text-2xl" />
                    )}
                  </motion.div>
                  <div className="ml-4 hidden md:block">
                    <div className={`font-semibold ${currentStep >= step.number ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                      Step {step.number}
                    </div>
                    <div className={`text-sm ${currentStep >= step.number ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                    currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center mb-6">
                      <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-xl mr-4">
                        <FiMapPin className="text-primary-600 dark:text-primary-400 text-2xl" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Information</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={deliveryAddress.street}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-opacity-20 focus:border-primary-500 transition-all"
                          placeholder="Enter your street address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={deliveryAddress.city}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-opacity-20 focus:border-primary-500 transition-all"
                            placeholder="City"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={deliveryAddress.state}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-opacity-20 focus:border-primary-500 transition-all"
                            placeholder="State"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={deliveryAddress.phoneNumber}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-opacity-20 focus:border-primary-500 transition-all"
                            placeholder="080XXXXXXXX"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                          Delivery Notes (Optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-opacity-20 focus:border-primary-500 transition-all resize-none"
                          rows="3"
                          placeholder="Any special instructions for delivery..."
                        ></textarea>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleNext}
                      className="w-full mt-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Continue to Review →
                    </motion.button>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Delivery Details Review */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-xl mr-4">
                            <FiMapPin className="text-primary-600 dark:text-primary-400 text-2xl" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Address</h2>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center space-x-2 font-semibold"
                        >
                          <FiEdit2 />
                          <span>Edit</span>
                        </motion.button>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 space-y-2">
                        <p className="text-gray-900 dark:text-white font-semibold">{deliveryAddress.street}</p>
                        <p className="text-gray-700 dark:text-gray-300">{deliveryAddress.city}, {deliveryAddress.state}</p>
                        <p className="text-gray-700 dark:text-gray-300 flex items-center">
                          <FiPhone className="mr-2" />
                          {deliveryAddress.phoneNumber}
                        </p>
                        {notes && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <strong>Notes:</strong> {notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Items Review */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center mb-6">
                        <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-xl mr-4">
                          <FiPackage className="text-primary-600 dark:text-primary-400 text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Items</h2>
                      </div>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id || item._id} className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                            <img
                              src={
                                item.image
                                  ? item.image.startsWith('http')
                                    ? item.image
                                    : `http://localhost:5000${item.image}`
                                  : 'https://via.placeholder.com/400'
                              }
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
                              alt={item.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary-600 dark:text-primary-400">₦{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                      >
                        ← Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <FiLock />
                            <span>Proceed to Payment</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-4 border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id || item._id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <img
                        src={
                          item.image
                            ? item.image.startsWith('http')
                              ? item.image
                              : `http://localhost:5000${item.image}`
                            : 'https://via.placeholder.com/400'
                        }
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                        <p className="text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white ml-2">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-100 dark:border-gray-700 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-semibold">₦{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Delivery</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Tax</span>
                  <span className="font-semibold">₦0</span>
                </div>
                <div className="border-t-2 border-gray-100 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      ₦{getCartTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="bg-gradient-to-br from-primary-50 to-lightGreen-50 dark:from-primary-900/20 dark:to-lightGreen-900/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <div className="bg-white dark:bg-gray-700 p-2 rounded-lg mr-3">
                    <FiShield className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium">Secure SSL Encryption</span>
                </div>
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <div className="bg-white dark:bg-gray-700 p-2 rounded-lg mr-3">
                    <FiLock className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">Protected by Paystack</span>
                </div>
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <div className="bg-white dark:bg-gray-700 p-2 rounded-lg mr-3">
                    <FiCheck className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="font-medium">Buyer Protection</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;