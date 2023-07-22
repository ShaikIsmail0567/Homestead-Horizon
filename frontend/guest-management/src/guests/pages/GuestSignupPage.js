import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast,
} from "@chakra-ui/react";

const GuestSignupPage = ({ handleLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Your API call for guest signup here
      // For demonstration purposes, let's assume the signup is successful
      // and we get a data with the guest's name and a token
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        handleLogin(data.name);
        // Save the token to session storage
        // sessionStorage.setItem('guestToken', data.token);
        sessionStorage.setItem("guestName", data.name);
        toast({
          title: "Signup Successful",
          description: `Welcome, ${data.name}!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/signin");
      } else {
        toast({
          title: "Signup Failed",
          description: "Failed to signup. Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error in signup:", error);
      toast({
        title: "Signup Failed",
        description: "Failed to signup. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex align="center" justify="center" h="100vh">
      <Box bg="blue.50" p={8} borderRadius="md" shadow="md" boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" width="400px">
        <Heading mb={6}>Guest Signup</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter your name"
              bg="white"
              border="2px solid"
              borderColor="gray.300"
              borderRadius="md"
              px={4}
              py={2}
              _focus={{
                outline: "none",
                borderColor: "blue.500",
                boxShadow: "0 0 0 2px rgba(0, 102, 255, 0.3)",
              }}
              _hover={{
                borderColor: "gray.500",
              }}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              bg="white"
              border="2px solid"
              borderColor="gray.300"
              borderRadius="md"
              px={4}
              py={2}
              _focus={{
                outline: "none",
                borderColor: "blue.500",
                boxShadow: "0 0 0 2px rgba(0, 102, 255, 0.3)",
              }}
              _hover={{
                borderColor: "gray.500",
              }}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              bg="white"
              border="2px solid"
              borderColor="gray.300"
              borderRadius="md"
              px={4}
              py={2}
              _focus={{
                outline: "none",
                borderColor: "blue.500",
                boxShadow: "0 0 0 2px rgba(0, 102, 255, 0.3)",
              }}
              _hover={{
                borderColor: "gray.500",
              }}
            />
            <FormHelperText>We'll never share your password.</FormHelperText>
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Sign up
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default GuestSignupPage;