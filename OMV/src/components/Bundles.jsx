import React from 'react';

const Bundles = ({ searchQuery, filters, sortOption, cartItems, onCartUpdate }) => {
  // Mock data for bundles
  const bundles = [
    {
      id: 'bundle1',
      name: 'Healthy Breakfast Bundle',
      price: 799,
      description: 'A collection of fresh fruits, oats, and organic honey for your morning routine.',
      items: ['Apples', 'Bananas', 'Oats', 'Honey'],
      location: 'Maharashtra',
      rating: 4.5,
      stock: 15,
      estimatedDelivery: '2 days',
      category: 'Breakfast'
    },
    {
      id: 'bundle2',
      name: 'Farm Fresh Vegetable Bundle',
      price: 599,
      description: 'Assorted fresh vegetables directly from local farms.',
      items: ['Tomatoes', 'Cucumbers', 'Carrots', 'Spinach', 'Potatoes'],
      location: 'Punjab',
      rating: 4.2,
      stock: 25,
      estimatedDelivery: '1 day',
      category: 'Vegetables'
    },
    {
      id: 'bundle3',
      name: 'Grains & Pulses Bundle',
      price: 899,
      description: 'High-quality grains and pulses for your kitchen.',
      items: ['Rice', 'Wheat', 'Chickpeas', 'Lentils', 'Millet'],
      location: 'Haryana',
      rating: 4.7,
      stock: 10,
      estimatedDelivery: '3 days',
      category: 'Grains'
    },
    {
      id: 'bundle4',
      name: 'Spice Essentials Bundle',
      price: 649,
      description: 'Collection of essential Indian spices for your daily cooking needs.',
      items: ['Turmeric', 'Cumin', 'Coriander', 'Chili Powder', 'Garam Masala'],
      location: 'Kerala',
      rating: 4.8,
      stock: 5,
      estimatedDelivery: '2 days',
      category: 'Spices'
    }
  ];

  // Apply filters
  let filteredBundles = [...bundles];

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredBundles = filteredBundles.filter(bundle => 
      bundle.name.toLowerCase().includes(query) || 
      bundle.description.toLowerCase().includes(query) ||
      bundle.category.toLowerCase().includes(query) ||
      bundle.items.some(item => item.toLowerCase().includes(query))
    );
  }

  // Apply location filter
  if (filters.selectedState) {
    filteredBundles = filteredBundles.filter(bundle => 
      bundle.location === filters.selectedState
    );
  }

  // Apply price filter
  filteredBundles = filteredBundles.filter(bundle => 
    bundle.price >= filters.priceRange[0] && bundle.price <= filters.priceRange[1]
  );

  // Apply rating filter
  if (filters.selectedRatings.length > 0) {
    filteredBundles = filteredBundles.filter(bundle => 
      filters.selectedRatings.some(rating => bundle.rating >= rating)
    );
  }

  // Apply stock filter
  if (filters.inStockOnly && !filters.includeOutOfStock) {
    filteredBundles = filteredBundles.filter(bundle => bundle.stock > 0);
  } else if (filters.inStockOnly) {
    filteredBundles = filteredBundles.filter(bundle => bundle.stock > 0);
  }

  // Apply sort option
  if (sortOption) {
    switch (sortOption) {
      case 'Most Popular':
        filteredBundles.sort((a, b) => b.rating - a.rating);
        break;
      case 'Best Rating':
        filteredBundles.sort((a, b) => b.rating - a.rating);
        break;
      case 'Newest':
        // For demo purposes, we'll just randomize
        filteredBundles.sort(() => Math.random() - 0.5);
        break;
      case 'Price: Low to High':
        filteredBundles.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        filteredBundles.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Farm Fresh Bundles</h2>
        
        {filteredBundles.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No bundles found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
            {filteredBundles.map((bundle) => (
              <div key={bundle.id} className="group relative border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-90">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{bundle.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{bundle.description}</p>
                
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-800">Items included:</h4>
                  <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                    {bundle.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-lg font-medium text-gray-900">₹{bundle.price}</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, index) => (
                      <svg 
                        key={index}
                        className={`h-4 w-4 ${index < Math.floor(bundle.rating) ? "text-yellow-400" : "text-gray-300"} fill-current`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600">{bundle.rating}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {bundle.stock > 0 ? `In stock (${bundle.stock})` : 'Out of stock'}
                  </span>
                  <span className="text-sm text-gray-600">
                    Delivery: {bundle.estimatedDelivery}
                  </span>
                </div>
                
                <button
                  className={`mt-4 w-full rounded-md px-4 py-2 text-sm font-medium ${
                    cartItems[bundle.id] 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                  onClick={() => onCartUpdate(bundle)}
                >
                  {cartItems[bundle.id] ? 'Remove from Cart' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bundles;