import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/api';
import { FiArrowRight, FiShoppingBag, FiUsers, FiTrendingUp, FiStar, FiCheck } from 'react-icons/fi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [stats, setStats] = useState({ products: 0, users: 0, sales: 0 });

  useEffect(() => {
    fetchFeaturedProducts();
    animateStats();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await getAllProducts({ sort: 'popular' });
      setFeaturedProducts(response.data.products.slice(0, 6));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const animateStats = () => {
    let products = 0;
    let users = 0;
    let sales = 0;

    const interval = setInterval(() => {
      if (products < 1500) products += 50;
      if (users < 5000) users += 150;
      if (sales < 10000) sales += 300;
      
      setStats({ products, users, sales });
      
      if (products >= 1500 && users >= 5000 && sales >= 10000) {
        clearInterval(interval);
      }
    }, 30);
  };

  const categories = [
    { name: 'Textbooks', icon: '📚', color: 'from-blue-500 to-blue-600', count: '500+' },
    { name: 'Electronics', icon: '💻', color: 'from-purple-500 to-purple-600', count: '300+' },
    { name: 'Furniture', icon: '🛋️', color: 'from-orange-500 to-orange-600', count: '200+' },
    { name: 'Clothing', icon: '👕', color: 'from-pink-500 to-pink-600', count: '400+' },
    { name: 'Stationery', icon: '✏️', color: 'from-green-500 to-green-600', count: '250+' },
    { name: 'Sports', icon: '⚽', color: 'from-red-500 to-red-600', count: '150+' },
  ];

  const features = [
    {
      icon: <FiCheck className="text-2xl" />,
      title: 'Verified Students',
      description: 'All users are verified university students',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: <FiShoppingBag className="text-2xl" />,
      title: 'Secure Payments',
      description: 'Safe transactions via Paystack',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: <FiUsers className="text-2xl" />,
      title: 'Direct Chat',
      description: 'Message vendors instantly',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: <FiTrendingUp className="text-2xl" />,
      title: 'Best Prices',
      description: 'Student-friendly pricing',
      color: 'bg-orange-50 text-orange-600'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-lightGreen-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4 px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-sm font-semibold">
                🎓 Nigeria's #1 Student Marketplace
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Buy, Sell & Trade
                <span className="block text-lightGreen-300">On Campus</span>
              </h1>
              
              <p className="text-xl sm:text-2xl mb-8 text-primary-100">
                Connect with students, find great deals, and trade safely within your university community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="group bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-lightGreen-100 transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Browse Products
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-800 bg-opacity-50 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white border-opacity-20">
                <div>
                  <div className="text-3xl font-bold">{stats.products.toLocaleString()}+</div>
                  <div className="text-primary-200 text-sm">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats.users.toLocaleString()}+</div>
                  <div className="text-primary-200 text-sm">Students</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">₦{(stats.sales / 1000).toFixed(0)}M+</div>
                  <div className="text-primary-200 text-sm">Traded</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-white bg-opacity-30 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-white bg-opacity-30 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-white bg-opacity-20 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Find exactly what you need</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary-500">
                  <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-4xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Trending Now</h2>
              <p className="text-xl text-gray-600">Hot deals from verified students</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-semibold group">
              View All
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-primary-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {product.condition}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <div className="flex items-center text-yellow-500">
                      <FiStar className="fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{product.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link to="/products" className="btn-primary inline-flex items-center">
              View All Products
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-lightGreen-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why MUBAEXPRESS?</h2>
            <p className="text-xl text-gray-600">Built for students, by students</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 mx-auto mb-4 ${feature.color} rounded-2xl flex items-center justify-center`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Start Trading?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of students already buying and selling on MUBAEXPRESS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-lightGreen-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Create Free Account
            </Link>
            <Link
              to="/products"
              className="bg-primary-800 bg-opacity-50 backdrop-blur-sm border-2 border-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-opacity-70 transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;