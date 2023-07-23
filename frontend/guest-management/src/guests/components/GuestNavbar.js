import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flex, Box, Button, Spacer } from '@chakra-ui/react';

const GuestNavbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();
  const handleSignout = () => {
    // Clear the guestToken from session storage and perform logout logic
    sessionStorage.removeItem('guestToken');
    sessionStorage.removeItem('guestName');

    handleLogout();
    navigate('/signin');
  };

  return (
    <Flex bg="blue.500" p="4" alignItems="center">
      <Box>
        <Link to="/">
          <Button colorScheme="white" variant="primary" _hover={{ backgroundColor: 'blue.300', color: 'white' }}>
            Guest Management
          </Button>
        </Link>
      </Box>
      {/* <Spacer /> */}
      <Box>
        {/* Add the "Dashboard" button */}
        <Link to="/dashboard">
          <Button colorScheme="white" variant="primary" mr="4"  margin-left= "20px" _hover={{ backgroundColor: 'blue.300', color: 'white' }}>
            Dashboard
          </Button>
        </Link>
        </Box>
        {/* Add the "Bookings" button */}
        <Box>
        <Link to="/bookings">
          <Button colorScheme="white" variant="primary" _hover={{ backgroundColor: 'blue.300', color: 'white' }} >
            Bookings
          </Button>
        </Link>
        </Box>
      <Spacer />
      {isLoggedIn ? (
        <>
          <Box mr="4">
            {/* Show guest name after successful signin */}
            <Button colorScheme="white" variant="primary" _hover={{ backgroundColor: 'blue.300', color: 'white' }}>
              {sessionStorage.getItem('guestName')}
            </Button>
          </Box>
          <Box mr="4">
            <Button colorScheme="white" variant="primary" _hover={{ backgroundColor: 'blue.300', color: 'white' }} onClick={handleSignout}>
              Sign Out
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box mr="4">
            <Link to="/signin">
              <Button colorScheme="white" variant="primary" _hover={{ backgroundColor: 'blue.300', color: 'white' }}>
                Sign In
              </Button>
            </Link>
          </Box>
          <Box>
            <Link to="/signup">
              <Button colorScheme="white" variant="primary" _hover={{ backgroundColor: 'blue.300', color: 'white' }}>
                Sign Up
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Flex>
  );
};

export default GuestNavbar;
