import React, { useState } from "react";
import AppContext from "./AppContext";
import Header from "./components/Header";
import AuthModal from "./components/AuthModal";
import ProductCard from "./components/ProductCard";
import StoreCard from "./components/StoreCard";
import Cart from "./components/Cart";
import Filters from "./components/Filters";
import { MapPin } from "lucide-react";

const mockStores = [
  { id: 1, name: "Fresh Mart", rating: 4.5, deliveryTime: "30-45 min", category: "Supermarket" },
  { id: 2, name: "Green Grocers", rating: 4.3, deliveryTime: "25-40 min", category: "Organic" },
  { id: 3, name: "Daily Needs", rating: 4.7, deliveryTime: "20-35 min", category: "Local Store" }
];

const mockProducts = [
  { id: 1, name: "Fresh Bananas", price: 40, category: "Fruits", image: "🍌", store: "Fresh Mart", stock: 50, rating: 4.2 },
  { id: 2, name: "Organic Apples", price: 120, category: "Fruits", image: "🍎", store: "Green Grocers", stock: 30, rating: 4.5 },
  { id: 3, name: "Basmati Rice 1kg", price: 80, category: "Grains", image: "🌾", store: "Daily Needs", stock: 100, rating: 4.8 },
  { id: 4, name: "Fresh Milk 1L", price: 50, category: "Dairy", image: "🥛", store: "Fresh Mart", stock: 25, rating: 4.3 },
  { id: 5, name: "Whole Wheat Bread", price: 35, category: "Bakery", image: "🍞", store: "Daily Needs", stock: 40, rating: 4.1 },
  { id: 6, name: "Farm Eggs (12pc)", price: 90, category: "Dairy", image: "🥚", store: "Green Grocers", stock: 60, rating: 4.6 }
];

const BBSRGroceryApp = () => {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentView, setCurrentView] = useState('home');

  const contextValue = {
    cartItems,
    searchTerm,
    setSearchTerm,
    addToCart: (product) => {
      setCartItems(prev => {
        const existingItem = prev.find(item => item.id === product.id);
        if (existingItem) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    },
    updateCartQuantity: (id, newQuantity) => {
      if (newQuantity <= 0) {
        setCartItems(prev => prev.filter(item => item.id !== id));
      } else {
        setCartItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    },
    removeFromCart: (id) => {
      setCartItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeFilter === 'All' || product.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50">
        <Header 
          user={user} 
          onShowAuth={() => setShowAuth(true)}
          onLogout={handleLogout}
        />
        
        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Delivering to: Bhubaneswar, Odisha</span>
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            <button onClick={() => setCurrentView('home')} className={\`px-4 py-2 rounded-lg \${currentView === 'home' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}\`}>🏠 Home</button>
            <button onClick={() => setCurrentView('stores')} className={\`px-4 py-2 rounded-lg \${currentView === 'stores' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}\`}>🏪 Stores</button>
            <button onClick={() => setShowCart(true)} className="px-4 py-2 rounded-lg bg-white text-gray-700">🛒 Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</button>
          </div>

          {currentView === 'home' && (
            <>
              <Filters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No products found matching your search.
                </div>
              )}
            </>
          )}

          {currentView === 'stores' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStores.map(store => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          )}
        </main>

        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onLogin={handleLogin} />
        <Cart isOpen={showCart} onClose={() => setShowCart(false)} />
      </div>
    </AppContext.Provider>
  );
};

export default BBSRGroceryApp;
