import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Flex, Link, Spacer, Button } from "@chakra-ui/react";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session data, tokens, or cookies here
    sessionStorage.removeItem("token");
    // Redirect to signin page
    navigate("/signin");
  };

  const token = sessionStorage.getItem("token");
  const isLoggedIn = !!token;

  return (
    <Flex bg="blue.500" p="4" alignItems="center">
      <Box>
        <Button
          colorScheme="white"
          variant="primary"
          _hover={{ backgroundColor: "blue.300", color: "white" }}
        >
          <Link as={RouterLink} to="/add-property" mr={4}>
            Add Room
          </Link>
        </Button>

        <Button
          colorScheme="white"
          variant="primary"
          _hover={{ backgroundColor: "blue.300", color: "white" }}
        >
          <Link as={RouterLink} to="/total-properties" mr={4}>
            Total Properties
          </Link>
        </Button>

        <Button
          colorScheme="white"
          variant="primary"
          _hover={{ backgroundColor: "blue.300", color: "white" }}
        >
          <Link as={RouterLink} to="/bookings">
            Bookings
          </Link>
        </Button>
      </Box>
      <Spacer />
      {isLoggedIn ? (
        <Button
          colorScheme="white"
          variant="primary"
          _hover={{ backgroundColor: "blue.300", color: "white" }}
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      ) : (
        <>
          <Button
            colorScheme="white"
            variant="primary"
            _hover={{ backgroundColor: "blue.300", color: "white" }}
          >
            <Link as={RouterLink} to="/signin" mr={4}>
              Sign In
            </Link>
          </Button>

          <Button
            colorScheme="white"
            variant="primary"
            _hover={{ backgroundColor: "blue.300", color: "white" }}
          >
            <Link as={RouterLink} to="/signup">
              Sign Up
            </Link>
          </Button>
        </>
      )}
    </Flex>
  );
};

export default Navbar;
