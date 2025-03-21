// FarmerProfilePage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Heart, Share, Phone, User, Mail, Hash } from "lucide-react";

const FarmerProfilePage = ({ cartItems = {}, onCartUpdate }) => {
  const { farmerId } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/farmers/${farmerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch farmer data");
        }
        const data = await response.json();
        // Transform the product data to match the format expected by the ProductCard
        const transformedProducts = data.products.map(product => ({
          id: product.id,
          farmerId: farmerId,
          farmerName: data.name,
          name: product.name,
          category: product.category,
          price: product.price ? Number.parseFloat(product.price) * 100 : 0,
          displayPrice: product.price ? `$${Number.parseFloat(product.price).toFixed(2)}` :
            "$0.00",
          image: product.image,
          location: product.location,
          stock: product.stock,
          estimatedDeliveryTime: product.estimatedDeliveryTime,
        }));
        setFarmer(data);
        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching farmer data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerData();
  }, [farmerId]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500 font-medium">Error loading farmer profile: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Not found state
  if (!farmer) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-700 font-medium">Farmer not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      {/* Farmer Profile Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gray-900 p-6 text-white">
          <h1 className="text-2xl font-bold">{farmer.name}</h1>
          <p className="text-gray-300 mt-1">Farmer ID: {farmer.id}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <MapPin className="mr-2 text-gray-500" size={18} />
              <span className="text-gray-700">{farmer.location}</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 text-gray-500" size={18} />
              <span className="text-gray-700">{farmer.phoneNumber}</span>
            </div>
            <div className="flex items-center">
              <Mail className="mr-2 text-gray-500" size={18} />
              <span className="text-gray-700">{farmer.email || "No email provided"}</span>
            </div>
            <div className="flex items-center">
              <Hash className="mr-2 text-gray-500" size={18} />
              <span className="text-gray-700">Years Active: {farmer.yearsActive || "N/A"}</span>
            </div>
          </div>
          
          {farmer.bio && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">About {farmer.name}</h3>
              <p className="text-gray-600">{farmer.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Products by this farmer */}
      <h2 className="text-xl font-bold mb-6">Products by {farmer.name}</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartItems={cartItems}
              onCartUpdate={onCartUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-white p-8 rounded-xl shadow-md max-w-md mx-auto">
            <p className="text-gray-500 text-lg">
              This farmer doesn't have any products listed at the moment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ProductCard component (simplified version for this page)
const ProductCard = ({ product, cartItems, onCartUpdate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const isInCart = cartItems && cartItems[product.id];

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    console.log("Sharing product:", product.name);
  };

  const handleCartButtonClick = (e) => {
    e.stopPropagation();
    onCartUpdate(product);
  };

  return (
    <div className="flex flex-col bg-gray-50 rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      {/* Header - Crop Name with dark background */}
      <div className="p-3 border-b border-gray-100 bg-gray-900 flex justify-between items-center">
        <h3 className="font-bold text-white truncate">{product.name}</h3>
      </div>

      {/* Product Image */}
      <div className="relative w-full h-52 bg-gray-200 flex items-center justify-center p-3">
        <div className="relative w-full h-full overflow-hidden border border-gray-900 rounded-lg p-1">
          <img
            src={
              product.image ||
              "https://res.cloudinary.com/john-mantas/image/upload/v1537291846/codepen/delicious-apples/green-apple-with-slice.png" ||
              "/placeholder.svg"
            }
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col bg-gray-200">
        {/* Action buttons */}
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
          <User size={22} stroke="#555" className="transition-colors duration-300" />
        </div>

        {/* Category */}
        <span className="inline-block bg-gradient-to-r from-gray-300 to-gray-300 rounded-full px-3 py-1 text-sm font-medium text-gray-900 mb-3 w-fit cursor-pointer hover:from-gray-400 hover:to-gray-400 transition-all duration-300">
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
            <span className="text-2xl font-semibold ml-0.5">
              {Number.parseFloat(product.price / 100).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleCartButtonClick}
            className={`px-4 py-1.5 ${
              isInCart ? "bg-blue-900 hover:bg-blue-700" : "bg-blue-900 hover:bg-blue-700"
            } text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow text-sm`}
          >
            {isInCart ? "Remove" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfilePage;