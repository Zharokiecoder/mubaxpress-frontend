import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllUsers, getStatistics, deactivateUser, activateUser, deleteUser, getAllProducts } from '../services/api';
import toast from 'react-hot-toast';
import { FiUsers, FiShoppingBag, FiTrendingUp, FiSearch, FiMoreVertical, FiUserCheck, FiUserX, FiTrash2, FiActivity, FiDollarSign, FiEye, FiShield } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, productsRes] = await Promise.all([
        getStatistics(),
        getAllUsers(),
        getAllProducts()
      ]);

      setStats(statsRes.data.statistics);
      setUsers(usersRes.data.users);
      setProducts(productsRes.data.products);
    } catch (error) {
      toast.error('Failed to load admin data');
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userId, userName) => {
    if (window.confirm(`Deactivate ${userName}?`)) {
      try {
        await deactivateUser(userId);
        toast.success('User deactivated');
        fetchData();
      } catch (error) {
        toast.error('Failed to deactivate user');
      }
    }
    setShowMenu(null);
  };

  const handleActivateUser = async (userId, userName) => {
    try {
      await activateUser(userId);
      toast.success(`${userName} activated`);
      fetchData();
    } catch (error) {
      toast.error('Failed to activate user');
    }
    setShowMenu(null);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Permanently delete ${userName}? This cannot be undone.`)) {
      try {
        await deleteUser(userId);
        toast.success('User deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
    setShowMenu(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === '' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                    <FiShield className="text-3xl" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">Admin Control Center</h1>
                    <p className="text-indigo-100 text-lg">Complete platform oversight</p>
                  </div>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <div className="text-sm text-indigo-100">Total Revenue</div>
                <div className="text-3xl font-bold">₦{(stats?.totalProducts * 5000 || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Users', 
              value: stats?.totalUsers || 0, 
              icon: FiUsers, 
              gradient: 'from-blue-500 to-blue-600',
              bg: 'bg-blue-50',
              textColor: 'text-blue-600'
            },
            { 
              label: 'Students', 
              value: stats?.totalStudents || 0, 
              icon: FiUserCheck, 
              gradient: 'from-green-500 to-green-600',
              bg: 'bg-green-50',
              textColor: 'text-green-600'
            },
            { 
              label: 'Vendors', 
              value: stats?.totalVendors || 0, 
              icon: FiShoppingBag, 
              gradient: 'from-purple-500 to-purple-600',
              bg: 'bg-purple-50',
              textColor: 'text-purple-600'
            },
            { 
              label: 'Products', 
              value: stats?.totalProducts || 0, 
              icon: FiActivity, 
              gradient: 'from-orange-500 to-orange-600',
              bg: 'bg-orange-50',
              textColor: 'text-orange-600'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-4 rounded-xl group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`text-3xl ${stat.textColor}`} />
                </div>
                <FiTrendingUp className="text-green-500 text-xl" />
              </div>
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              <div className="mt-3 text-xs text-gray-500 flex items-center">
                <span className="text-green-600 font-semibold mr-1">+12%</span>
                <span>vs last month</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="border-b border-gray-100 bg-gray-50">
            <nav className="flex space-x-1 p-2">
              {[
                { id: 'overview', label: 'Overview', icon: FiActivity },
                { id: 'users', label: 'Users', icon: FiUsers },
                { id: 'products', label: 'Products', icon: FiShoppingBag }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 font-semibold text-sm rounded-xl transition-all flex items-center justify-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-white hover:text-primary-600'
                  }`}
                >
                  <tab.icon />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Recent Activity */}
                  <div className="bg-gradient-to-br from-primary-50 to-lightGreen-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <FiActivity className="mr-2 text-primary-600" />
                      Recent Users
                    </h3>
                    <div className="space-y-3">
                      {users.slice(0, 5).map(user => (
                        <div key={user._id} className="flex items-center justify-between bg-white rounded-xl p-3">
                          <div className="flex items-center space-x-3">
                            <img src={user.profileImage} alt={user.fullName} className="w-10 h-10 rounded-full border-2 border-primary-200" />
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{user.fullName}</p>
                              <p className="text-xs text-gray-600">{user.role}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Latest Products */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <FiShoppingBag className="mr-2 text-blue-600" />
                      Latest Products
                    </h3>
                    <div className="space-y-3">
                      {products.slice(0, 5).map(product => (
                        <div key={product._id} className="flex items-center justify-between bg-white rounded-xl p-3">
                          <div className="flex items-center space-x-3">
                            <img src={product.images[0]} alt={product.title} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate">{product.title}</p>
                              <p className="text-xs text-gray-600">{product.category}</p>
                            </div>
                          </div>
                          <span className="text-primary-600 font-bold text-sm">₦{product.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center hover:border-primary-500 transition-all">
                    <FiEye className="text-4xl text-primary-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">
                      {products.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Views</div>
                  </div>
                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center hover:border-green-500 transition-all">
                    <FiUserCheck className="text-4xl text-green-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.isActive).length}
                    </div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center hover:border-blue-500 transition-all">
                    <FiShoppingBag className="text-4xl text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">
                      {stats?.activeProducts || 0}
                    </div>
                    <div className="text-sm text-gray-600">Active Products</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                      />
                    </div>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                    >
                      <option value="">All Roles</option>
                      <option value="student">Students</option>
                      <option value="vendor">Vendors</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">University</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredUsers.map((user) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img src={user.profileImage} alt={user.fullName} className="w-10 h-10 rounded-full border-2 border-gray-200 mr-3" />
                              <div>
                                <div className="font-semibold text-gray-900">{user.fullName}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                              user.role === 'vendor' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.university}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right relative">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setShowMenu(showMenu === user._id ? null : user._id)}
                              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <FiMoreVertical />
                            </motion.button>
                            
                            {showMenu === user._id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-10 overflow-hidden"
                              >
                                {user.isActive ? (
                                  <button
                                    onClick={() => handleDeactivateUser(user._id, user.fullName)}
                                    className="block w-full text-left px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 transition-colors flex items-center"
                                  >
                                    <FiUserX className="mr-2" />
                                    Deactivate User
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleActivateUser(user._id, user.fullName)}
                                    className="block w-full text-left px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors flex items-center"
                                  >
                                    <FiUserCheck className="mr-2" />
                                    Activate User
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteUser(user._id, user.fullName)}
                                  className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                                >
                                  <FiTrash2 className="mr-2" />
                                  Delete User
                                </button>
                              </motion.div>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No users found matching your criteria
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Management</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary-500 transition-all"
                    >
                      <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover" />
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
                        <div className="flex items-center justify-between text-sm mb-3">
                          <span className="text-gray-600">{product.category}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-primary-600 mb-2">
                          ₦{product.price.toLocaleString()}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t">
                          <span>Vendor: {product.vendor?.fullName}</span>
                          <span className="flex items-center">
                            <FiEye className="mr-1" />
                            {product.views}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No products available
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;