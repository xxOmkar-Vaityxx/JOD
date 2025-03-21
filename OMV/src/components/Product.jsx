"use client"
import { useState, useEffect } from "react"
import { MapPin, Heart, Share, User } from "lucide-react"

const ProductCard = ({ product, setActiveCategory, cartItems, onCartUpdate }) => {
  const [isLiked, setIsLiked] = useState(false)
  const isInCart = cartItems && cartItems[product.id]
  
  const handleLikeClick = (e) => {
    e.stopPropagation() // Prevent event bubbling
    setIsLiked(!isLiked)
  }
  
  const handleShareClick = (e) => {
    e.stopPropagation() // Prevent event bubbling
    console.log("Sharing product:", product.name)
  }
  
  const handleFarmerProfileClick = (e) => {
    e.stopPropagation() // Prevent event bubbling
    console.log("Opening farmer profile for:", product.farmerName, "with ID:", product.farmerId)
    window.open(`/farmer-profile/${product.farmerId}`, "_blank")
  }
  
  const handleCartButtonClick = (e) => {
    e.stopPropagation() // Stop event propagation
    onCartUpdate(product)
  }
  
  return (
    <div className="flex flex-col bg-gray-50 rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      {/* Header - Crop Name with dark background (removed expand button) */}
      <div className="p-3 border-b border-gray-100 bg-gray-900 flex justify-between items-center">
        <h3 className="font-bold text-white truncate">{product.name}</h3>
      </div>
      
      {/* Product Image - with yellow-300 bezel effect */}
      <div className="relative w-full h-52 bg-gray-200 flex items-center justify-center p-3">
        <div className="relative w-full h-full overflow-hidden border border-gray-900 rounded-lg p-1">
          <img
            src={product.image || "https://res.cloudinary.com/john-mantas/image/upload/v1537291846/codepen/delicious-apples/green-apple-with-slice.png" || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
      
      {/* Always display expanded content */}
      <div className="p-4 flex flex-col bg-gray-200">
        {/* Action buttons - with light background */}
        <div className="flex justify-between mb-3">
          <div className="flex">
            <button onClick={handleLikeClick} className="mr-4 hover:scale-110 transition-transform">
              <Heart
                size={22}
                stroke={isLiked ? "#d95552" : "#555"}
                fill={isLiked ? "#d95552" : "none"}
                className="transition-colors duration-300"
              />
            </button>
            <button onClick={handleShareClick} className="mr-4 hover:scale-110 transition-transform">
              <Share
                size={22}
                stroke="#555"
                className="transition-colors duration-300 hover:stroke-gray-700"
              />
            </button>
          </div>
          {/* Farmer profile button moved to right */}
          <button
            onClick={handleFarmerProfileClick}
            className="hover:scale-110 transition-transform relative group"
          >
            <User
              size={22}
              stroke="#555"
              className="transition-colors duration-300 hover:stroke-gray-700"
            />
            <span className="absolute -top-8 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              View Farmer: {product.farmerName}
            </span>
          </button>
        </div>
        
        {/* Category with gradient rounded background */}
        <span
          onClick={(e) => {
            e.stopPropagation() // Prevent event bubbling
            setActiveCategory(product.category)
          }}
          className="inline-block bg-gradient-to-r from-gray-300 to-gray-300 rounded-full px-3 py-1 text-sm font-medium text-gray-900 mb-3 w-fit cursor-pointer hover:from-gray-400 hover:to-gray-400 transition-all duration-300"
        >
          {product.category}
        </span>
        
        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={14} className="mr-1 text-gray-400" />
          <span className="truncate">{product.location}</span>
        </div>
        
        {/* Stock and Estimated Delivery */}
        <div className="text-gray-600 text-sm space-y-2 mb-4">
          <p>Stock: {product.stock}</p>
          <p>Estimated Delivery: {product.estimatedDeliveryTime}</p>
        </div>
        
        {/* Price and Add to Cart Button */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-900 mt-2 -mx-4 -mb-4 rounded-b-xl">
          <div className="text-white font-sans">
            <span className="text-lg font-light">$</span>
            <span className="text-2xl font-semibold ml-0.5">{Number.parseFloat(product.price / 100).toFixed(2)}</span>
          </div>
          <button
            onClick={handleCartButtonClick}
            className={`px-4 py-1.5 ${isInCart ? "bg-blue-900 hover:bg-blue-700" : "bg-blue-900 hover:bg-blue-700"} text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow text-sm`}
          >
            {isInCart ? "Remove" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  )
}

// The main Product component
const Product = ({ searchQuery = "", filters = {}, sortOption = "Most Popular", cartItems = {}, onCartUpdate }) => {
  const [activeCategory, setActiveCategory] = useState("All")
  const [sortedProducts, setSortedProducts] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Categories array
  const categories = ["All", "Grains", "Spices", "Fruits", "Textiles", "Pulses", "Oilseeds", "Other"]
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        console.log("Fetching products from backend...")
        const response = await fetch("http://localhost:5000/api/products")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        console.log("Raw products data:", data)
        console.log("Number of products received:", data.length)
        
        if (!Array.isArray(data)) {
          console.error("Received non-array data:", data)
          throw new Error("Invalid data format received from server")
        }
        
        const transformedProducts = data.map((item) => ({
          id: item.id || String(Math.random()), // Fallback ID if none provided
          farmerId: item.farmerId || item.id, // Use farmerId or fall back to id
          farmerName: item.farmerName || "Unknown Farmer",
          phoneNumber: item.phoneNumber || "",
          name: item.name || "Unnamed Product",
          category: item.category || "Other",
          price: item.price ? Number.parseFloat(item.price) * 100 : 0,
          displayPrice: item.price ? `$${Number.parseFloat(item.price).toFixed(2)}` : "$0.00",
          image: item.image || "",
          location: item.location || "Unknown Location",
          stock: item.stock || 0,
          estimatedDeliveryTime: item.estimatedDeliveryTime || "1-2 weeks",
        }))

        console.log("Transformed products:", transformedProducts)
        console.log("Number of transformed products:", transformedProducts.length)
        setProducts(transformedProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])
  
  // Filter and sort products
  useEffect(() => {
    console.log("Active products before filtering:", products.length)
    console.log("Current search query:", searchQuery)
    
    // Simple array check to avoid errors
    if (!Array.isArray(products) || products.length === 0) {
      setSortedProducts([])
      return
    }
    
    // Clone the products to avoid mutation issues
    let filtered = [...products]
    
    // Apply category filter if not "All"
    if (activeCategory !== "All") {
      filtered = filtered.filter((product) => product.category === activeCategory)
    }
    
    // Apply search query filter if there is a query
    if (searchQuery && searchQuery.trim() !== "") {
      const searchLower = searchQuery.toLowerCase()
      filtered = filtered.filter((product) => {
        const nameMatch = product.name && product.name.toLowerCase().includes(searchLower)
        const categoryMatch = product.category && product.category.toLowerCase().includes(searchLower)
        const locationMatch = product.location && product.location.toLowerCase().includes(searchLower)
        return nameMatch || categoryMatch || locationMatch
      })
    }
    
    // Apply location filter if selected
    if (filters.selectedState && filters.selectedState !== "") {
      filtered = filtered.filter((product) => {
        return product.location && product.location.includes(filters.selectedState)
      })
    }
    
    // Apply price range filter
    if (filters.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
      const minPrice = filters.priceRange[0] * 100
      const maxPrice = filters.priceRange[1] * 100
      filtered = filtered.filter((product) => product.price >= minPrice && product.price <= maxPrice)
    }
    
    // Sort the filtered products
    const sorted = [...filtered]
    switch (sortOption) {
      case "Price: Low to High":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "Price: High to Low":
        sorted.sort((a, b) => b.price - a.price)
        break
      default: // Most Popular or any other option
        // Keep the default order
        break
    }
    
    console.log("Filtered products count:", filtered.length)
    console.log("Final sorted products count:", sorted.length)
    setSortedProducts(sorted)
  }, [activeCategory, products, searchQuery, filters, sortOption])
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500 font-medium">Error loading products: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 bg-gray-50">
      <div className="my-8">
        {/* Category buttons */}
        <div className="flex flex-col md:flex-row justify-start items-center gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto pb-4 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-3 rounded-full border ${
                  activeCategory === category
                    ? "bg-gray-900 text-white border-gray-900 shadow-lg scale-105 hover:bg-gray-800"
                    : "border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 hover:shadow-md bg-white hover:bg-gray-50"
                } whitespace-nowrap text-sm font-medium transition-all duration-300 cursor-pointer transform hover:scale-105 focus:outline-none focus:ring-gray-500 focus:ring-offset-2 active:scale-95`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                setActiveCategory={setActiveCategory}
                cartItems={cartItems}
                onCartUpdate={onCartUpdate}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="bg-white p-8 rounded-xl shadow-md max-w-md mx-auto">
                <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
                <button
                  onClick={() => setActiveCategory("All")}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                >
                  Show All Products
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Product