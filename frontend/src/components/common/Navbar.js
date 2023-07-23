import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Link, Spacer, Button } from '@chakra-ui/react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session data, tokens, or cookies here
    sessionStorage.removeItem('token');
    // Redirect to signin page
    navigate('/signin');
  };

  const token = sessionStorage.getItem('token');
  const isLoggedIn = !!token;

  return (
    <Flex bg="gray.200" p={4}>
      <Box>
        <Link as={RouterLink} to="/add-property" mr={4}>
          Add Room
        </Link>
        <Link as={RouterLink} to="/total-properties" mr={4}>
          Total Properties
        </Link>
        <Link as={RouterLink} to="/bookings">
          Bookings
        </Link>
      </Box>
      <Spacer />
      {isLoggedIn ? (
        <Button colorScheme="blue" onClick={handleLogout}>
          Sign Out
        </Button>
      ) : (
        <>
          <Link as={RouterLink} to="/signin" mr={4}>
            Sign In
          </Link>
          <Link as={RouterLink} to="/signup">
            Sign Up
          </Link>
        </>
      )}
    </Flex>
  );
};

export default Navbar;
