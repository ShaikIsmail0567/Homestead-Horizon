import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import DashboardPage from './pages/DashboardPage';
import AddPropertyPage from './pages/AddPropertyPage';
import BookingsPage from './pages/BookingsPage';
import Navbar from './components/common/Navbar';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <ChakraProvider>
      <CSSReset />
      <Router>
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage handleLogin={handleLogin} />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-property" element={<AddPropertyPage />} />
          <Route path="/total-properties" element={<DashboardPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
