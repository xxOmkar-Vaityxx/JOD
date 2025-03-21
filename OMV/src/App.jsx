import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoreHeader from './components/StoreHeader';
import { NavbarMenu } from './components/NavbarMenu';
import Product from './components/Product';
import Bundles from './components/Bundles';
import SidebarFilter from './components/SidebarFilter';
import CartPage from './components/CartPage';
import OrderConfirmation from './components/OrderConfirmation';
import FarmerProfilePage from './components/FarmerProfilePage';
import Home from './components/Home';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Most Popular');
  const [cartItems, setCartItems] = useState({});
  const [cartProducts, setCartProducts] = useState([]);
  const [filters, setFilters] = useState({
    selectedState: '',
    priceRange: [0, 5000],
    selectedRatings: [],
    selectedDeliveryTime: [],
    selectedPaymentOptions: [],
    inStockOnly: false,
    includeOutOfStock: true
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSort = (option) => {
    setSortOption(option);
  };

  const handleCartUpdate = (product) => {
    setCartItems(prev => {
      const newCart = { ...prev };
      if (newCart[product.id]) {
        delete newCart[product.id];
        setCartProducts(currentProducts =>
          currentProducts.filter(p => p.id !== product.id)
        );
      } else {
        newCart[product.id] = true;
        setCartProducts(currentProducts => {
          const productExists = currentProducts.some(p => p.id === product.id);
          if (!productExists) {
            return [...currentProducts, product];
          }
          return currentProducts;
        });
      }
      return newCart;
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
    setCartProducts(currentProducts =>
      currentProducts.filter(p => p.id !== productId)
    );
  };

  const ProductsPage = () => (
    <div className="flex w-full">
      <SidebarFilter onFilterChange={handleFilterChange} initialFilters={filters} />
      <div className="flex-1 min-w-0">
        <StoreHeader
          onSearch={setSearchQuery}
          onSort={handleSort}
          cartItemsCount={Object.keys(cartItems).length}
        />
        <Product
          searchQuery={searchQuery}
          filters={filters}
          sortOption={sortOption}
          cartItems={cartItems}
          onCartUpdate={handleCartUpdate}
        />
      </div>
    </div>
  );

  const BundlesPage = () => (
    <div className="flex w-full">
      <SidebarFilter onFilterChange={handleFilterChange} initialFilters={filters} />
      <div className="flex-1 min-w-0">
        <StoreHeader
          onSearch={setSearchQuery}
          onSort={handleSort}
          cartItemsCount={Object.keys(cartItems).length}
        />
        <Bundles
          searchQuery={searchQuery}
          filters={filters}
          sortOption={sortOption}
          cartItems={cartItems}
          onCartUpdate={handleCartUpdate}
        />
      </div>
    </div>
  );

  return (
    <Router>
      <div className="font-inter">
        <NavbarMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products-page" element={<ProductsPage />} />
          <Route path="/bundles" element={<BundlesPage />} />
          <Route path="/cart" element={
            <CartPage
              cartProducts={cartProducts}
              onRemoveFromCart={handleRemoveFromCart}
            />
          } />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/orders" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow p-8 max-w-md w-full">
              <h1 className="text-2xl font-bold mb-4">My Orders</h1>
              <p className="text-gray-500">Your order history will appear here.</p>
            </div>
          </div>} />
          {/* <Route path="/farmer-profile/:farmerId" element={
            <FarmerProfilePage
              cartItems={cartItems}
              onCartUpdate={handleCartUpdate}
            />
          } /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;