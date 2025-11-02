import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SimpleImageUpload from '../components/SimpleImageUpload';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiPackage, FiDollarSign, FiTrendingUp, FiShoppingBag, FiX, FiCheck, FiStar } from 'react-icons/fi';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Textbooks',
    condition: 'Good',
    stockQuantity: 1,
    location: {
      university: user?.university || '',
      campus: '',
      state: ''
    },
    tags: '',
    images: ['']
  });

  const categories = ['Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Stationery', 'Sports Equipment', 'Kitchen Items', 'Accommodation', 'Services', 'Other'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getMyProducts();
      setProducts(response.data.products);
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty image URLs
    const validImages = formData.images.filter(img => img && img.trim() !== '');
    
    if (validImages.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      images: validImages
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, dataToSend);
        toast.success('Product updated! ✨');
      } else {
        await createProduct(dataToSend);
        toast.success('Product created! 🎉');
      }
      
      resetForm();
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      condition: product.condition,
      stockQuantity: product.stockQuantity,
      location: product.location,
      tags: product.tags.join(', '),
      images: product.images.length > 0 ? product.images : ['']
    });
    setShowModal(true);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'Textbooks',
      condition: 'Good',
      stockQuantity: 1,
      location: {
        university: user?.university || '',
        campus: '',
        state: ''
      },
      tags: '',
      images: ['']
    });
  };

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.isActive).length,
    totalViews: products.reduce((sum, p) => sum + p.views, 0),
    totalRevenue: products.reduce((sum, p) => sum + (p.price * (10 - p.stockQuantity)), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 mb-8 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Vendor Dashboard</h1>
              <p className="text-primary-100 text-lg">Manage your products and track performance</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-white text-primary-600 px-6 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2"
            >
              <FiPlus className="text-xl" />
              <span>Add Product</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Products', value: stats.totalProducts, icon: FiPackage, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Active Products', value: stats.activeProducts, icon: FiShoppingBag, color: 'from-green-500 to-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
            { label: 'Total Views', value: stats.totalViews, icon: FiEye, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            { label: 'Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <stat.icon className={`text-2xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
                <FiTrendingUp className="text-green-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Products List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="bg-primary-100 dark:bg-primary-900/20 p-2 rounded-xl mr-3">
                <FiShoppingBag className="text-primary-600 dark:text-primary-400" />
              </span>
              My Products
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-full inline-block mb-6">
                  <FiPackage className="text-gray-400 text-6xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">No products yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">Start by adding your first product</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(true)}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <FiPlus />
                  <span>Add Product</span>
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-300 group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={product.images[0] ? `http://localhost:5000${product.images[0]}` : 'https://via.placeholder.com/400'}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(product)}
                            className="bg-white p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
                          >
                            <FiEdit2 className="text-blue-600" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product._id, product.title)}
                            className="bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                          >
                            <FiTrash2 className="text-red-600" />
                          </motion.button>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            product.isActive 
                              ? 'bg-green-500 text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg text-xs font-semibold">
                            {product.category}
                          </span>
                          <span className="bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 px-2 py-1 rounded-lg text-xs font-semibold">
                            {product.condition}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            ₦{product.price.toLocaleString()}
                          </div>
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <FiStar className="fill-current" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{product.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center">
                            <FiEye className="mr-1" />
                            <span>{product.views} views</span>
                          </div>
                          <div className="flex items-center">
                            <FiPackage className="mr-1" />
                            <span>{product.stockQuantity} left</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white flex items-center justify-between z-10 rounded-t-3xl">
                <h2 className="text-2xl font-bold flex items-center">
                  {editingProduct ? (
                    <>
                      <FiEdit2 className="mr-3" />
                      Edit Product
                    </>
                  ) : (
                    <>
                      <FiPlus className="mr-3" />
                      Add New Product
                    </>
                  )}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <FiX className="text-2xl" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Product Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Enter product title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="input-field resize-none"
                    placeholder="Describe your product..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price (₦) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Stock Quantity *</label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      required
                      min="1"
                      className="input-field"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Condition *</label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {conditions.map((cond) => (
                        <option key={cond} value={cond}>{cond}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="textbook, programming, CSC101"
                  />
                </div>

                {/* Product Images Upload Section */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Product Images *
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    📸 Upload up to 5 images. First image will be the main display.
                  </p>
                  
                  {formData.images.map((image, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Image {index + 1} {index === 0 && <span className="text-primary-600 dark:text-primary-400">(Main)</span>}
                        </label>
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = formData.images.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, images: newImages.length > 0 ? newImages : [''] }));
                            }}
                            className="text-xs text-red-600 dark:text-red-400 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <SimpleImageUpload 
                        image={image}
                        setImage={(newImage) => {
                          const newImages = [...formData.images];
                          newImages[index] = newImage;
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                        label={`Upload Image ${index + 1}`}
                      />
                    </div>
                  ))}
                  
                  {formData.images.length < 5 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))}
                      className="w-full mt-3 py-2 border-2 border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      + Add Another Image ({formData.images.length}/5)
                    </motion.button>
                  )}
                </div>

                <div className="flex space-x-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <FiCheck />
                    <span>{editingProduct ? 'Update' : 'Create'} Product</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorDashboard;