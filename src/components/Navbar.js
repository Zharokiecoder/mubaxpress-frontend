import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FiShoppingBag, 
  FiShoppingCart, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiSun,
  FiMoon,
  FiHeart,
  FiMessageCircle,
  FiPackage,
  FiSettings
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl"
            >
              <FiShoppingBag className="text-white text-2xl" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              StudentMart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/products" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors"
            >
              Products
            </Link>
            
            {user && user.role === 'vendor' && (
              <Link 
                to="/vendor/dashboard" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors"
              >
                Dashboard
              </Link>
            )}
            
            {user && user.role === 'admin' && (
              <Link 
                to="/admin/dashboard" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors"
              >
                Admin
              </Link>
            )}

            {user && (
              <Link 
                to="/messages" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors flex items-center space-x-1"
              >
                <FiMessageCircle size={20} />
                <span>Messages</span>
              </Link>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <FiSun className="text-yellow-400" size={22} />
              ) : (
                <FiMoon className="text-gray-600" size={22} />
              )}
            </motion.button>

            {/* Wishlist */}
            {user && (
              <Link to="/wishlist" className="relative hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiHeart className="text-gray-700 dark:text-gray-300" size={22} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </motion.button>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative hidden md:block">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiShoppingCart className="text-gray-700 dark:text-gray-300" size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </motion.button>
            </Link>

            {/* User Menu - Desktop */}
            {user ? (
              <div className="relative hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <img
                    src={user.profileImage?.startsWith('http')
                      ? user.profileImage
                      : user.profileImage
                        ? `http://localhost:5000${user.profileImage}`
                        : 'https://via.placeholder.com/150'
                    }
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full border-2 border-primary-300 dark:border-primary-700"
                  />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{user.fullName.split(' ')[0]}</span>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 border border-gray-200 dark:border-gray-700"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FiUser className="text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-800 dark:text-gray-200">Profile</span>
                      </Link>
                      
                      {user.role === 'vendor' && (
                        <Link
                          to="/vendor/dashboard"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FiPackage className="text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-800 dark:text-gray-200">My Products</span>
                        </Link>
                      )}

                      <Link
                        to="/wishlist"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FiHeart className="text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-800 dark:text-gray-200">Wishlist</span>
                        {wishlist.length > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                            {wishlist.length}
                          </span>
                        )}
                      </Link>

                      <Link
                        to="/messages"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FiMessageCircle className="text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-800 dark:text-gray-200">Messages</span>
                      </Link>

                      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                      >
                        <FiLogOut className="text-red-600" />
                        <span className="text-red-600 font-semibold">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {mobileMenuOpen ? (
                <FiX className="text-gray-700 dark:text-gray-300" size={24} />
              ) : (
                <FiMenu className="text-gray-700 dark:text-gray-300" size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-4 space-y-1">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300 font-semibold"
              >
                Products
              </Link>

              {user && (
                <>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300 font-semibold"
                  >
                    <div className="flex items-center space-x-3">
                      <FiHeart size={20} />
                      <span>Wishlist</span>
                    </div>
                    {wishlist.length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300 font-semibold"
                  >
                    <div className="flex items-center space-x-3">
                      <FiShoppingCart size={20} />
                      <span>Cart</span>
                    </div>
                    {cartItemCount > 0 && (
                      <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1 font-bold">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300 font-semibold"
                  >
                    <FiMessageCircle size={20} />
                    <span>Messages</span>
                  </Link>

                  {user.role === 'vendor' && (
                    <Link
                      to="/vendor/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300 font-semibold"
                    >
                      <FiPackage size={20} />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300 font-semibold"
                    >
                      <FiSettings size={20} />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300 font-semibold"
                  >
                    <FiUser size={20} />
                    <span>Profile</span>
                  </Link>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 font-semibold w-full text-left"
                  >
                    <FiLogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {!user && (
                <div className="space-y-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block btn-secondary text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block btn-primary text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;