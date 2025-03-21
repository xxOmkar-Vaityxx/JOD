import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        // Fetch both addresses to get the latest one
        const response = await fetch('http://localhost:5000/api/addresses');
        if (!response.ok) {
          throw new Error('Failed to fetch order data');
        }
        
        const addresses = await response.json();
        
        // Get the most recent address (last one in the array)
        if (addresses.length > 0) {
          const latestAddress = addresses[addresses.length - 1];
          setOrderData(latestAddress);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchLatestOrder();
  }, []);

  const handleGoToOrders = () => {
    navigate('/orders');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading order details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  if (!orderData) {
    return <div className="flex justify-center items-center h-screen text-yellow-500">No order information found</div>;
  }

  // Extract the ObjectId from the _id field
  const orderId = orderData._id;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
        {/* Box icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-md relative flex items-center justify-center">
            <div className="w-12 h-10 bg-amber-200 rounded-sm"></div>
            {/* Tape */}
            <div className="absolute top-1/3 w-16 h-1 bg-amber-300"></div>
            {/* Red label */}
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-red-500"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">Thank you for your order!</h1>
        <p className="text-gray-700 mb-6">
          Your order number is <span className="font-bold">#{orderId}</span>. We have emailed your order confirmation and will update you once it's shipped.
        </p>
        <button
          onClick={handleGoToOrders}
          className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
        >
          Go to my orders
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;