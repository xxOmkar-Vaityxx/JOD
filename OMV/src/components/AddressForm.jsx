import React, { useState } from 'react';

const FormInput = ({ label, id, type, placeholder, required = false, pattern, maxLength,
value, onChange }) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={id} className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      required={required}
      pattern={pattern}
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2
      focus:ring-gray-500 focus:border-gray-500"
    />
  </div>
);

const PhoneInput = ({ label, id, required = false, value, onChange }) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={id} className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex">
      <div className="flex items-center px-3 py-2 bg-gray-100 border border-r-0
      border-gray-300 rounded-l-md"
      >
        +91
      </div>
      <input
        id={id}
        name={id}
        type="tel"
        placeholder="1234567890"
        required={required}
        pattern="[0-9]{10}"
        maxLength="10"
        value={value}
        onChange={onChange}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none
        focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
      />
    </div>
  </div>
);

const QuantitySelector = ({ product, onQuantityChange }) => {
  const quantities = [5, 10, 25, 50, 75, 100];
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Select quantity for {product.name}</h4>
      <div className="flex flex-wrap gap-2">
        {quantities.map((qty) => (
          <button
            key={qty}
            type="button"
            onClick={() => onQuantityChange(product.id, qty)}
            className={`px-4 py-2 border ${
              product.quantity === qty
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-800'
            } rounded-md transition-colors hover:bg-gray-200 hover:text-gray-900`}
          >
            {qty} kg
          </button>
        ))}
      </div>
    </div>
  );
};

const AddressForm = ({ cartProducts, onQuantityChange, onAddressSaved }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    state: '',
    zip: '',
    phone: '',
    saveAddress: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Create the complete data object with address and product quantities
      const completeData = {
        ...formData,
        products: cartProducts.map(product => ({
          productId: product.id,
          name: product.name,
          quantity: product.quantity || 5, // Default to 5 if not set
          price: product.price
        }))
      };
      console.log('Submitting address data:', completeData);
      // Send data to backend
      const response = await fetch('http://localhost:5000/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save address');
      }
      
      const result = await response.json();
      console.log('Address saved successfully:', result);
      setSubmitSuccess(true);

      // Call the navigation function to go to the next step (review)
      if (onAddressSaved) {
        onAddressSaved();
      }
    } catch (error) {
      console.error('Error saving address:', error);
      setSubmitError(error.message || 'An error occurred while saving your address');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          Error: {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Address saved successfully!
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="First name"
          id="firstName"
          type="text"
          placeholder="Rahul"
          required
          value={formData.firstName}
          onChange={handleChange}
        />
        <FormInput
          label="Last name"
          id="lastName"
          type="text"
          placeholder="Sharma"
          required
          value={formData.lastName}
          onChange={handleChange}
        />
        <div className="col-span-1 md:col-span-2">
          <FormInput
            label="Address line 1"
            id="address1"
            type="text"
            placeholder="Apartment, suite, unit, etc. "
            required
            value={formData.address1}
            onChange={handleChange}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <FormInput
            label="Address line 2"
            id="address2"
            type="text"
            placeholder="Street name and city"
            value={formData.address2}
            onChange={handleChange}
          />
        </div>
        <FormInput
          label="State"
          id="state"
          type="text"
          placeholder="Maharashtra"
          required
          value={formData.state}
          onChange={handleChange}
        />
        <FormInput
          label="Zip / Postal code"
          id="zip"
          type="text"
          placeholder="123456"
          required
          pattern="[0-9]{6}"
          maxLength="6"
          value={formData.zip}
          onChange={handleChange}
        />
        <div className="col-span-1 md:col-span-2">
          <PhoneInput
            label="Phone number"
            id="phone"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="saveAddress"
              checked={formData.saveAddress}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm">Save this address for future orders</span>
          </label>
        </div>
      </div>
      
      {/* Product Quantity Selectors */}
      <div className="mt-8 space-y-6">
        <h3 className="text-lg font-medium pb-2 border-b border-gray-200">Select Product
        Quantities</h3>
        {cartProducts.map(product => (
          <QuantitySelector
            key={product.id}
            product={product}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;