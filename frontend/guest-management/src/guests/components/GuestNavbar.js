import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Box, Button, Spacer } from '@chakra-ui/react';

const GuestNavbar = ({ isLoggedIn, handleLogout }) => {
  const handleSignout = () => {
    // Clear the guestToken from session storage and perform logout logic
    sessionStorage.removeItem('guestToken');
    sessionStorage.removeItem('guestName');
    handleLogout();
  };

  return (
    <Flex bg="blue.500" p="4" alignItems="center">
      <Box>
        <Link to="/">
          <Button colorScheme="white" variant="link">
            Guest Management
          </Button>
        </Link>
      </Box>
      <Spacer />
      {isLoggedIn ? (
        <>
          <Box mr="4">
            {/* Show guest name after successful signin */}
            <Button colorScheme="white" variant="link">
              {sessionStorage.getItem('guestName')}
            </Button>
          </Box>
          <Box mr="4">
            <Button colorScheme="white" variant="link" onClick={handleSignout}>
              Sign Out
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box mr="4">
            <Link to="/signin">
              <Button colorScheme="white" variant="link">
                Sign In
              </Button>
            </Link>
          </Box>
          <Box>
            <Link to="/signup">
              <Button colorScheme="white" variant="link">
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
