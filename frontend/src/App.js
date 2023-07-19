import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import DashboardPage from './pages/DashboardPage';
import AddPropertyPage from './pages/AddPropertyPage';
import BookingsPage from './pages/BookingsPage';
import Navbar from './components/common/Navbar';

const App = () => {
  return (
    <ChakraProvider>
      <CSSReset />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
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
