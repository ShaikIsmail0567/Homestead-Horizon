import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import GuestSignupPage from './guests/pages/GuestSignupPage';
import GuestSigninPage from './guests/pages/GuestSigninPage';
import DashboardPage from './guests/pages/DashboardPage';
// import GuestAddPropertyPage from './pages/GuestAddPropertyPage';
// import GuestBookingsPage from './pages/GuestBookingsPage';
import GuestNavbar from './guests/components/GuestNavbar';
// import GuestMyPropertiesPage from './pages/GuestMyPropertiesPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('guestToken'));

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    // Save the guest name to state
    sessionStorage.setItem('guestName', name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <ChakraProvider>
      <CSSReset />
      <Router>
        <GuestNavbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/signup" element={<GuestSignupPage handleLogin={handleLogin} />} />
          <Route path="/signin" element={<GuestSigninPage handleLogin={handleLogin} />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Add other guest management routes here */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;