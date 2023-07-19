import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Link, Spacer } from '@chakra-ui/react';

const Navbar = () => {
  return (
    <Flex bg="gray.200" p={4}>
      <Box>
        <Link as={RouterLink} to="/signup" mr={4}>
          Signup
        </Link>
        <Link as={RouterLink} to="/signin" mr={4}>
          Signin
        </Link>
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
      {/* Add any additional content or user-related info here */}
    </Flex>
  );
};

export default Navbar;
