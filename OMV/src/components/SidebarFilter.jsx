import React, { useState } from 'react';
import { Star, MapPin, TruckIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const SidebarFilter = ({ onFilterChange, initialFilters }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange || [0, 5000]);
  const [selectedState, setSelectedState] = useState(initialFilters.selectedState || '');
  const [selectedRatings, setSelectedRatings] = useState(initialFilters.selectedRatings || []);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(initialFilters.selectedDeliveryTime || []);
  const [selectedPaymentOptions, setSelectedPaymentOptions] = useState(initialFilters.selectedPaymentOptions || []);
  const [inStockOnly, setInStockOnly] = useState(initialFilters.inStockOnly || false);
  const [includeOutOfStock, setIncludeOutOfStock] = useState(initialFilters.includeOutOfStock || true);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const getApplyButtonText = () => {
    const filtersCount = [
      selectedState,
      ...selectedRatings,
      ...selectedDeliveryTime,
      ...selectedPaymentOptions,
      inStockOnly,
      includeOutOfStock
    ].filter(Boolean).length;
    return filtersCount === 1 ? "Apply Filter" : "Apply Filters";
  };

  const handleApplyFilters = () => {
    const newFilters = {
      selectedState,
      priceRange,
      selectedRatings,
      selectedDeliveryTime,
      selectedPaymentOptions,
      inStockOnly,
      includeOutOfStock
    };
    onFilterChange(newFilters);
  };

  const handleMinPriceChange = (e) => {
    const newMin = parseInt(e.target.value);
    setPriceRange([newMin, Math.max(priceRange[1], newMin)]);
  };

  const handleMaxPriceChange = (e) => {
    const newMax = parseInt(e.target.value);
    setPriceRange([Math.min(priceRange[0], newMax), newMax]);
  };

  return (
    <div className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-84'} bg-gray-800 shadow-xl h-screen sticky top-0`}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute  right-0 top-1/2 transform  -translate-y-1/2 bg-gray-500 rounded-lg p-2 text-white z-10 hover:bg-gray-700"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Expanded State Content */}
      <div className={`${isCollapsed ? 'hidden' : 'block'} p-4 scrollable-content h-full`}>
        {/* Apply Filters Button */}
        <button
          className="mb-4 px-4 py-2 bg-gray-200 text-black rounded-lg w-full hover:bg-gray-500 transition-colors"
          onClick={handleApplyFilters}
        >
          {getApplyButtonText()}
        </button>

        {/* Location Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-white" />
            <h3 className="font-semibold text-white">Location</h3>
          </div>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-1 focus:ring-black focus:border-black"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">Select State</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="font-semibold text-white mb-3">Price Range (₹)</h3>
          <div className="px-2">
            <div className="flex items-center justify-between mb-2">
              <input
                type="number"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={handleMinPriceChange}
                className="w-20 p-1 border border-gray-300 rounded-lg text-sm bg-white text-gray-800"
              />
              <span className="text-white">-</span>
              <input
                type="number"
                min={priceRange[0]}
                max="5000"
                value={priceRange[1]}
                onChange={handleMaxPriceChange}
                className="w-20 p-1 border border-gray-300 rounded-lg text-sm bg-white text-gray-800"
              />
            </div>
            <div className="mt-4">
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer accent-black"
                value={priceRange[1]}
                onChange={handleMaxPriceChange}
              />
            </div>
          </div>
        </div>

        {/* Customer Rating */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star size={18} className="text-white" />
            <h3 className="font-semibold text-white">Customer Rating</h3>
          </div>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-black focus:ring-black"
                  checked={selectedRatings.includes(rating)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRatings([...selectedRatings, rating]);
                    } else {
                      setSelectedRatings(selectedRatings.filter(r => r !== rating));
                    }
                  }}
                />
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className={index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                    />
                  ))}
                  <span className="text-sm text-white">&amp; Up</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Time */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-white" />
            <h3 className="font-semibold text-white">Delivery Time</h3>
          </div>
          <div className="space-y-2">
            {["Next Day Delivery", "2-3 Days", "4-7 Days"].map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-black focus:ring-black"
                  checked={selectedDeliveryTime.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDeliveryTime([...selectedDeliveryTime, option]);
                    } else {
                      setSelectedDeliveryTime(selectedDeliveryTime.filter(o => o !== option));
                    }
                  }}
                />
                <span className="text-white">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Options */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TruckIcon size={18} className="text-white" />
            <h3 className="font-semibold text-white">Payment Options</h3>
          </div>
          <div className="space-y-2">
            {["Pay on Delivery", "Online Payment", "UPI", "Card Payment"].map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-black focus:ring-black"
                  checked={selectedPaymentOptions.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPaymentOptions([...selectedPaymentOptions, option]);
                    } else {
                      setSelectedPaymentOptions(selectedPaymentOptions.filter(o => o !== option));
                    }
                  }}
                />
                <span className="text-white">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <h3 className="font-semibold text-white mb-3">Availability</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-black focus:ring-black"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span className="text-white">In Stock Only</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-black focus:ring-black"
                checked={includeOutOfStock}
                onChange={(e) => setIncludeOutOfStock(e.target.checked)}
              />
              <span className="text-white">Include Out of Stock</span>
            </label>
          </div>
        </div>
      </div>

      {/* Collapsed State Icons */}
      {isCollapsed && (
        <div className="flex flex-col items-center gap-6 pt-16">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsCollapsed(false)}>
            <MapPin size={20} className="text-white" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsCollapsed(false)}>
            <Star size={20} className="text-white" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsCollapsed(false)}>
            <Clock size={20} className="text-white" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsCollapsed(false)}>
            <TruckIcon size={20} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarFilter;