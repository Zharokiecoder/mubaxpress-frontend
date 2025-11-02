import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllProducts } from '../services/api';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FiSearch, FiFilter, FiX, FiGrid, FiList, FiMapPin, FiEye, FiStar, FiHeart, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    university: '',
    sort: 'createdAt'
  });

  const categories = [
    'All',
    'Textbooks',
    'Electronics',
    'Furniture',
    'Clothing',
    'Stationery',
    'Sports Equipment',
    'Kitchen Items',
    'Accommodation',
    'Services',
    'Other'
  ];

  const conditions = ['All', 'New', 'Like New', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.condition && filters.condition !== 'All') params.condition = filters.condition;
      if (filters.university) params.university = filters.university;
      if (filters.sort) params.sort = filters.sort;

      const response = await getAllProducts(params);
      setProducts(response.data.products);
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      university: '',
      sort: 'createdAt'
    });
    toast.success('Filters reset');
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast.success('Removed from wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      toast.success('Added to wishlist ❤️');
    }
  };

  const ProductCard = ({ product }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary-500"
    >
      <Link to={`/products/${product._id}`} className="block relative">
        <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={product.images[0]?.startsWith('http') 
              ? product.images[0] 
              : `http://localhost:5000${product.images[0] || ''}`
            }
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
            alt={product.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {product.condition}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product._id);
              }}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                wishlist.includes(product._id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white bg-opacity-80 text-gray-700 hover:bg-red-500 hover:text-white'
              }`}
            >
              <FiHeart className={wishlist.includes(product._id) ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Quick actions on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button className="bg-white text-primary-600 px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center space-x-2 shadow-xl">
              <FiShoppingCart />
              <span>Quick View</span>
            </button>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <FiMapPin className="mr-1" size={14} />
          <span className="truncate">{product.location?.university || 'N/A'}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-yellow-500">
              <FiStar className="fill-current" size={16} />
              <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <FiEye className="mr-1" size={14} />
              <span>{product.views}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            ₦{product.price.toLocaleString()}
          </div>
          <Link
            to={`/products/${product._id}`}
            className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300"
          >
            View
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
          <img
            src={product.vendor?.profileImage?.startsWith('http')
              ? product.vendor.profileImage
              : product.vendor?.profileImage
                ? `http://localhost:5000${product.vendor.profileImage}`
                : 'https://via.placeholder.com/150'
            }
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
            alt={product.vendor?.fullName}
            className="w-8 h-8 rounded-full mr-2 border-2 border-primary-200"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{product.vendor?.fullName}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ProductCardList = ({ product }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-500"
    >
      <div className="flex">
        <Link to={`/products/${product._id}`} className="w-64 h-48 relative flex-shrink-0">
          <img
            src={product.images[0]?.startsWith('http') 
              ? product.images[0] 
              : `http://localhost:5000${product.images[0]}`
            }
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            {product.condition}
          </span>
        </Link>

        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <Link to={`/products/${product._id}`}>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                  {product.title}
                </h3>
              </Link>
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`p-2 rounded-full transition-all ${
                  wishlist.includes(product._id)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white'
                }`}
              >
                <FiHeart className={wishlist.includes(product._id) ? 'fill-current' : ''} />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{product.description}</p>

            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <FiMapPin className="mr-1" />
                <span>{product.location?.university}</span>
              </div>
              <div className="flex items-center">
                <FiStar className="fill-current text-yellow-500 mr-1" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <FiEye className="mr-1" />
                <span>{product.views} views</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              ₦{product.price.toLocaleString()}
            </div>
            <Link
              to={`/products/${product._id}`}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Deals</h1>
            <p className="text-xl text-primary-100">Browse thousands of products from verified students</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search for products, categories..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-3">
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 dark:text-white font-medium"
              >
                <option value="createdAt">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
              >
                <FiFilter />
                <span>Filters</span>
              </button>

              {/* View Toggle */}
              <div className="hidden md:flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
                  }`}
                >
                  <FiGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
                  }`}
                >
                  <FiList size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Min Price (₦)</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Max Price (₦)</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Any"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Condition</label>
                    <select
                      value={filters.condition}
                      onChange={(e) => handleFilterChange('condition', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      {conditions.map((cond) => (
                        <option key={cond} value={cond === 'All' ? '' : cond}>{cond}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-semibold"
                  >
                    <FiX />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 dark:text-gray-400 font-medium"
          >
            {loading ? 'Loading...' : `${products.length} products found`}
          </motion.p>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-6'}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <Skeleton height={256} />
                <div className="p-5">
                  <Skeleton count={2} />
                  <Skeleton width={100} className="mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-gray-400 text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No products found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters or search terms</p>
            <button onClick={resetFilters} className="btn-primary">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {products.map((product) => (
                  <ProductCardList key={product._id} product={product} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Products;