import React, { useState } from 'react';
import Info from './Info';
import AddressForm from './AddressForm';
import Review from './Review';
import OrderConfirmation from './OrderConfirmation';

const CartPage = ({ cartProducts: initialCartProducts, onRemoveFromCart }) => {
  // State to manage cart products with quantities
  const [cartProducts, setCartProducts] = useState(
    initialCartProducts.map(product => ({
      ...product,
      quantity: 5 // Default quantity
    }))
  );
  
  // State to track current step in checkout process
  const [currentStep, setCurrentStep] = useState(0);
  
  // Steps for the checkout process - added order confirmation
  const steps = [
    { label: 'Shipping address', active: currentStep === 0 },
    { label: 'Review your order', active: currentStep === 1 },
    { label: 'Order confirmation', active: currentStep === 2 }
  ];
  
  // Calculate total price considering quantities
  const totalPrice = cartProducts.reduce((sum, product) => {
    return sum + (product.price * (product.quantity || 1));
  }, 0);
  
  const handleRemoveItem = (productId) => {
    if (onRemoveFromCart) {
      onRemoveFromCart(productId);
    }
    // Also update local state
    setCartProducts(cartProducts.filter(p => p.id !== productId));
  };
  
  const handleQuantityChange = (productId, quantity) => {
    setCartProducts(cartProducts.map(product =>
      product.id === productId ? { ...product, quantity } : product
    ));
  };
  
  // Navigation functions
  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  
  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  // Special handler for final confirmation step - this would normally navigate to a new page
  // but for our example it just sets the current step
  const handleOrderPlaced = () => {
    setCurrentStep(2);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logo */}
      <div className="py-6 px-8">
        <span className="text-2xl font-semibold text-gray-900">FarmBasket</span>
      </div>
      
{/* Checkout Steps Progress Bar */}
{currentStep < 2 && (
  <div className="max-w-4xl mx-auto mb-8 px-4">
    <div className="flex justify-center">
      <div className="flex items-center w-full max-w-md">
        {steps.slice(0, 2).map((step, index) => (
          <div key={step.label} className={`flex items-center ${index === 0 ? 'w-1/2' : 'w-1/2'}`}>
            <div className="flex items-center">
              {/* Step indicator - either completed (checkmark), active (filled), or inactive */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center
                ${index < currentStep ? 'bg-green-500' : 
                  step.active ? 'bg-gray-900' : 'bg-gray-300'}`}>
                {index < currentStep ? (
                  // Completed step - green checkmark
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : step.active ? (
                  // Active step - white dot in dark circle
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                ) : null}
              </div>
              
              {/* Step label */}
              <span className={`ml-3 text-sm font-medium ${
                index < currentStep ? 'text-green-500' : 
                step.active ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
            
            {/* Connector line between steps */}
            {index < 1 && (
              <div className="flex-grow mx-6 h-0.5 border-t border-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
)}
      {/* Main content */}
      {currentStep < 2 ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Form */}
            <div className="lg:col-span-2">
              {currentStep === 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-6">Shipping address</h2>
                  <AddressForm
                    cartProducts={cartProducts}
                    onQuantityChange={handleQuantityChange}
                    onAddressSaved={goToNextStep} // This will be called after successful submission
                  />
                </div>
              )}
              {currentStep === 1 && (
                <Review
                  cartProducts={cartProducts}
                  totalPrice={`$${(totalPrice / 100).toFixed(2)}`}
                  onPrevStep={goToPrevStep}
                  onOrderPlaced={handleOrderPlaced} // Pass the handler to the Review component
                />
              )}
            </div>
            {/* Right side - Order summary */}
            <div className="lg:col-span-1">
              <Info
                cartProducts={cartProducts}
                totalPrice={`$${(totalPrice / 100).toFixed(2)}`}
                onRemoveItem={handleRemoveItem}
              />
            </div>
          </div>
        </div>
      ) : (
        // Confirmation page takes up the full width
        <OrderConfirmation />
      )}
    </div>
  );
};

export default CartPage;