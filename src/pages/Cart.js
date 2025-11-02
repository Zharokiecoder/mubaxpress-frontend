import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiTrash2, FiShoppingCart, FiArrowRight, FiMinus, FiPlus, FiPackage, FiShield, FiTruck, FiHeadphones } from 'react-icons/fi';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Safety check for cartItems
  if (!cartItems) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading cart...</p>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const handleRemove = (itemId, itemName) => {
    removeFromCart(itemId);
    toast.success(`${itemName} removed from cart`);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-primary-100 to-lightGreen-100 dark:from-primary-900/20 dark:to-lightGreen-900/20 p-8 rounded-full inline-block mb-6">
            <FiShoppingCart className="text-primary-600 dark:text-primary-400 text-7xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Add some amazing products to get started!</p>
          <Link to="/products" className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4">
            <FiPackage />
            <span>Browse Products</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
            <p className="text-gray-600 dark:text-gray-400">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <FiTrash2 />
            <span>Clear Cart</span>
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id || item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    {/* Product Image */}
                    <Link to={`/products/${item.id || item._id}`} className="flex-shrink-0">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={
                          item.image
                            ? item.image.startsWith('http')
                              ? item.image
                              : `http://localhost:5000${item.image}`
                            : 'https://via.placeholder.com/400'
                        }
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
                        alt={item.title}
                        className="w-32 h-32 object-cover rounded-xl border-2 border-gray-100 dark:border-gray-700"
                      />
                    </Link>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0 text-center md:text-left">
                      <Link
                        to={`/products/${item.id || item._id}`}
                        className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 mb-2 block"
                      >
                        {item.title}
                      </Link>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {item.category && (
                          <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">{item.category}</span>
                        )}
                        {item.condition && (
                          <span className="bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full font-semibold">{item.condition}</span>
                        )}
                      </div>
                      {item.vendor && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Seller: <span className="font-semibold">{item.vendor.fullName || 'Vendor'}</span>
                        </p>
                      )}
                      <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                        ₦{item.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-center md:items-end space-y-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                        <motion.button
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-3 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <FiMinus className="text-gray-700 dark:text-gray-300" />
                        </motion.button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val > 0) {
                              updateQuantity(item.id, val);
                            }
                          }}
                          className="w-16 text-center bg-transparent py-2 font-bold text-lg focus:outline-none dark:text-white"
                          min="1"
                          max={item.stockQuantity || 99}
                        />
                        <motion.button
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.stockQuantity || 99)}
                          className="p-3 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                          <FiPlus className="text-gray-700 dark:text-gray-300" />
                        </motion.button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-center md:text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Subtotal</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemove(item.id, item.title)}
                        className="text-red-600 hover:text-red-700 flex items-center space-x-2 font-semibold px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <FiTrash2 />
                        <span>Remove</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
            >
              <span>← Continue Shopping</span>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-4 border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="bg-primary-100 dark:bg-primary-900/20 p-2 rounded-lg mr-3">
                  <FiShoppingCart className="text-primary-600 dark:text-primary-400" />
                </span>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-bold">₦{getCartTotal().toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-green-600 dark:text-green-400">FREE</span>
                </div>

                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Tax</span>
                  <span className="font-bold">₦0</span>
                </div>
                
                <div className="border-t-2 border-gray-100 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      ₦{getCartTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight />
              </motion.button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg mr-3">
                      <FiShield className="text-green-600 dark:text-green-400" />
                    </div>
                    <span>Secure Payment with Paystack</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
                      <FiTruck className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>Campus Delivery Available</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg mr-3">
                      <FiHeadphones className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>Direct Chat with Vendors</span>
                  </div>
                </div>
              </div>

              {/* Promo Code (UI Only) */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Have a promo code?
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    Apply
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recommended Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You might also like</h2>
          <div className="text-center text-gray-600 dark:text-gray-400 py-8">
            <p>Browse more products to add to your cart!</p>
            <Link to="/products" className="btn-secondary inline-block mt-4">
              View All Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;