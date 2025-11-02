import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      vendor: product.vendor
    });
    toast.success('Added to cart!');
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FiHeart className="text-4xl text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </motion.div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
              <FiHeart className="text-8xl text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Wishlist is Empty</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Start adding products you love to your wishlist!
              </p>
              <Link
                to="/products"
                className="btn-primary inline-flex items-center space-x-2 text-lg"
              >
                <span>Browse Products</span>
                <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-red-500 group"
              >
                {/* Image */}
                <Link to={`/products/${product._id}`} className="block relative">
                  <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={product.images[0]?.startsWith('http') 
                        ? product.images[0] 
                        : `http://localhost:5000${product.images[0]}`
                      }
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
                      alt={product.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(product._id);
                      }}
                      className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group/btn"
                    >
                      <FiTrash2 className="text-red-500 group-hover/btn:scale-110 transition-transform" size={18} />
                    </button>

                    {/* Stock Badge */}
                    {product.stockQuantity === 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Out of Stock
                      </div>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  {/* Category */}
                  <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                    {product.category}
                  </span>

                  {/* Title */}
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.stockQuantity} left
                    </span>
                  </div>

                  {/* Vendor */}
                  <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <img
                      src={product.vendor?.profileImage?.startsWith('http')
                        ? product.vendor.profileImage
                        : product.vendor?.profileImage
                          ? `http://localhost:5000${product.vendor.profileImage}`
                          : 'https://via.placeholder.com/150'
                      }
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                      alt={product.vendor?.fullName}
                      className="w-8 h-8 rounded-full border-2 border-primary-200 dark:border-primary-800"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {product.vendor?.fullName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {product.vendor?.university}
                      </p>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stockQuantity === 0}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <FiShoppingCart size={18} />
                    <span>{product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {wishlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-gradient-to-r from-primary-50 to-lightGreen-50 dark:from-primary-900/20 dark:to-lightGreen-900/20 rounded-2xl p-8 border-2 border-primary-200 dark:border-primary-800"
          >
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Love what you see?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Add your favorite items to cart and check out!
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  to="/products"
                  className="btn-secondary"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/cart"
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiShoppingCart />
                  <span>View Cart</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;