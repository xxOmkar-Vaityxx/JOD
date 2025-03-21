import React from 'react';
import { X } from 'lucide-react';

const Info = ({ cartProducts, totalPrice, onRemoveItem }) => {
  // Define shipping price as a constant to ensure consistency
  const SHIPPING_PRICE = 9.99;
  
  // Function to get product image - ensures images are displayed
  const getProductImage = (product) => {
    if (product.image && product.image.trim() !== '') {
      return product.image;
    }
    return "https://res.cloudinary.com/john-mantas/image/upload/v1537291846/codepen/delicious-apples/green-apple-with-slice.png";
  };
  
  // Calculate the final total with shipping
  const finalTotal = (parseFloat(totalPrice.replace('$', '')) + SHIPPING_PRICE).toFixed(2);
  
  return (
    <div className="space-y-4">
      {/* First card - Order summary totals */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">{totalPrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Shipping</span>
            <span className="text-gray-500">${SHIPPING_PRICE.toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-gray-400">
            <div className="flex justify-between items-center">
              <span className="font-medium">Order Total</span>
              <span className="font-bold">${finalTotal}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Second card - Order items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Order Summary</h2>
          <span className="ml-1 text-sm text-gray-500">({cartProducts.length})</span>
        </div>
        <div className="space-y-6">
          {cartProducts.map((product) => (
            <div key={product.id} className="flex items-start relative pt-3 border-t border-gray-300">
              {/* Product Image */}
              <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-100 flex-shrink-0">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Product Details */}
              <div className="ml-4 flex-grow">
                <h3 className="font-medium text-gray-800">{product.name}</h3>
                <p className="bg-gray-200 rounded-full px-3 py-1 text-sm font-sm text-gray-500 w-fit mt-1">
                  {product.category}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Qty: {product.quantity || 1} kg
                </p>
                {/* Farmer ID added here */}
                <p className="text-xs text-gray-400 mt-1">
                  Farmer ID: {product.farmerId || "Unknown"}
                </p>
                <div className="flex justify-between items-center mt-1">
                  {/* Empty div to maintain layout */}
                </div>
              </div>
              {/* Price moved to the right in a box */}
              <div className="absolute right-0 top-16">
                <span className="inline-block bg-gray-900 text-white rounded-md px-3 py-1 font-medium text-sm">
                  ${((product.price * (product.quantity || 1)) / 100).toFixed(2)}
                </span>
              </div>
              {/* Remove button */}
              <button
                onClick={() => onRemoveItem && onRemoveItem(product.id)}
                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-red-900 bg-red-100 rounded-full transition-colors"
                aria-label="Remove item"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Perks section - simplified without chat */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-center text-gray-700 font-medium mb-6">The perks of every order</h3>
        <div className="flex justify-center space-x-10">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 flex items-center justify-center mb-2">
              <span className="text-xl">🍎</span>
            </div>
            <span className="text-xs text-gray-500 text-center">Fresh and High Quality</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 flex items-center justify-center mb-2">
              <span className="text-xl">🚚</span>
            </div>
            <span className="text-xs text-gray-500 text-center">Free Delivery</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 flex items-center justify-center mb-2">
              <span className="text-xl">👨‍🌾</span>
            </div>
            <span className="text-xs text-gray-500 text-center">Trusted Sellers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;