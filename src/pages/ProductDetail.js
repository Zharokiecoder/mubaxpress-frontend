import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct, addReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiShare2, 
  FiStar, 
  FiMapPin,
  FiMessageCircle,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiZoomIn
} from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageZoom, setImageZoom] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProduct(id);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (quantity > product.stockQuantity) {
      toast.error('Not enough stock available');
      return;
    }

    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      vendor: product.vendor
    });

    toast.success('Added to cart!');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to leave a review');
      navigate('/login');
      return;
    }

    if (user._id === product.vendor._id) {
      toast.error('You cannot review your own product');
      return;
    }

    setSubmittingReview(true);

    try {
      await addReview(id, reviewForm);
      toast.success('Review submitted successfully!');
      setReviewForm({ rating: 5, comment: '' });
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton height={500} />
            <div>
              <Skeleton height={40} className="mb-4" />
              <Skeleton height={30} width={200} className="mb-4" />
              <Skeleton count={3} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-600 dark:hover:text-primary-400">Products</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{product.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className={`relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border-4 border-gray-100 dark:border-gray-700 shadow-xl ${imageZoom ? 'overflow-auto' : ''}`}>
              <motion.img
                src={
                  product.images[selectedImage]
                    ? product.images[selectedImage].startsWith('http') || product.images[selectedImage].startsWith('https')
                      ? product.images[selectedImage]
                      : `http://localhost:5000${product.images[selectedImage]}`
                    : 'https://via.placeholder.com/600'
                }
                onError={(e) => { 
                  console.log('Image failed to load:', e.target.src);
                  e.target.src = 'https://via.placeholder.com/600'; 
                }}
                alt={product.title}
                className={`w-full h-[500px] object-cover transition-transform duration-500 ${imageZoom ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
                onClick={() => setImageZoom(!imageZoom)}
              />
              <button
                onClick={() => setImageZoom(!imageZoom)}
                className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiZoomIn className="text-gray-700 dark:text-gray-300" size={20} />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-xl overflow-hidden border-4 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-primary-600 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <img 
                      src={
                        img
                          ? img.startsWith('http') || img.startsWith('https')
                            ? img
                            : `http://localhost:5000${img}`
                          : 'https://via.placeholder.com/400'
                      }
                      onError={(e) => { 
                        console.log('Thumbnail failed:', e.target.src);
                        e.target.src = 'https://via.placeholder.com/400'; 
                      }}
                      alt={`${product.title} ${index + 1}`} 
                      className="w-full h-24 object-cover" 
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Title & Category */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-semibold">
                  {product.category}
                </span>
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <FiShare2 className="text-gray-600 dark:text-gray-400" size={20} />
                </button>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{product.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}
                      size={20}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-primary-50 to-lightGreen-50 dark:from-primary-900/20 dark:to-lightGreen-900/20 p-6 rounded-2xl border-2 border-primary-200 dark:border-primary-800">
              <div className="flex items-baseline space-x-3">
                <span className="text-5xl font-bold text-primary-600 dark:text-primary-400">₦{product.price.toLocaleString()}</span>
                <span className="text-gray-600 dark:text-gray-400">per item</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Stock: <span className={`font-semibold ${product.stockQuantity > 10 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {product.stockQuantity} available
                </span>
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold text-xl transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-gray-900 dark:text-white w-16 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold text-xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <FiShoppingCart size={24} />
                <span>Add to Cart</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWishlist(product._id)}
                className={`p-4 border-2 rounded-xl transition-all ${
                  isInWishlist(product._id)
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                }`}
              >
                <FiHeart 
                  size={24} 
                  className={isInWishlist(product._id) ? 'text-red-500 fill-current' : 'text-primary-600 dark:text-primary-400'}
                />
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <FiTruck className="mx-auto mb-2 text-primary-600 dark:text-primary-400" size={24} />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Fast Delivery</p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <FiShield className="mx-auto mb-2 text-primary-600 dark:text-primary-400" size={24} />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Secure Payment</p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <FiRefreshCw className="mx-auto mb-2 text-primary-600 dark:text-primary-400" size={24} />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Easy Returns</p>
              </div>
            </div>

            {/* Vendor Info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Seller Information</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.vendor?.profileImage?.startsWith('http') 
                      ? product.vendor.profileImage 
                      : product.vendor?.profileImage 
                        ? `http://localhost:5000${product.vendor.profileImage}`
                        : 'https://via.placeholder.com/150'
                    }
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                    alt={product.vendor?.fullName}
                    className="w-16 h-16 rounded-full border-4 border-primary-200 dark:border-primary-800 shadow-lg"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{product.vendor?.fullName}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiMapPin size={14} />
                      <span>{product.vendor?.university}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <FiStar className="text-yellow-400 fill-current" size={14} />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {product.vendor?.rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/messages"
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiMessageCircle size={18} />
                  <span>Message</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Customer Reviews</h2>

            {/* Review Form */}
            {user && user._id !== product.vendor?._id && (
              <form onSubmit={handleSubmitReview} className="mb-12 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Write a Review</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <FiStar
                          size={32}
                          className={star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-opacity-20 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                    placeholder="Share your experience with this product..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submittingReview}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </motion.button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {product.reviews.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No reviews yet. Be the first to review this product!</p>
              ) : (
                product.reviews.map((review) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.user?.profileImage?.startsWith('http')
                          ? review.user.profileImage
                          : review.user?.profileImage
                            ? `http://localhost:5000${review.user.profileImage}`
                            : 'https://via.placeholder.com/150'
                        }
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                        alt={review.user?.fullName}
                        className="w-12 h-12 rounded-full border-2 border-primary-200 dark:border-primary-800"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{review.user?.fullName}</h4>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  size={16}
                                  className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;