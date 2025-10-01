import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage.tsx';
import LoginPage from './components/LoginPage.tsx';
import RegisterPage from './components/RegisterPage.tsx';
import Dashboard from './components/Dashboard.tsx';
import CreateOrder from './components/CreateOrder.tsx';
import ManufacturerCatalog from './components/ManufacturerCatalog.tsx';
import OrderDetails from './components/OrderDetails.tsx';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there is a saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/dashboard" /> : <LandingPage />
            } 
          />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" /> : 
              <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              user ? <Navigate to="/dashboard" /> : 
              <RegisterPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? <Dashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/create-order" 
            element={
              user ? <CreateOrder user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/manufacturer-catalog" 
            element={
              user ? <ManufacturerCatalog user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/order/:orderId" 
            element={
              user ? <OrderDetails user={user} /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
