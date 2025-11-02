import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyPayment } from '../services/api';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (reference) {
      verifyPaymentStatus(reference);
    }
  }, [searchParams]);

  const verifyPaymentStatus = async (reference) => {
    try {
      const response = await verifyPayment(reference);
      setOrder(response.data.order);
    } catch (err) {
      setError('Failed to verify payment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">✗</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/cart" className="btn-primary">
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FiCheckCircle className="text-green-600 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>

          {order && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-gray-900">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold text-primary-600">₦{order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-semibold text-green-600 capitalize">{order.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <p className="font-semibold text-blue-600 capitalize">{order.orderStatus}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link to="/products" className="block w-full btn-primary py-3">
              Continue Shopping
            </Link>
            <Link to="/profile" className="block w-full btn-secondary py-3">
              View My Orders
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-center text-gray-600">
              <FiPackage className="mr-2" />
              <p className="text-sm">You can contact the vendor directly via messages for delivery arrangements.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;