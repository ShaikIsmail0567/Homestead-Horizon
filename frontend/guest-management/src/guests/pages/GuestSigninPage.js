import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';

const GuestSigninPage = ({ handleLogin }) => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      // Your API call for guest signin here
      // For demonstration purposes, let's assume the signin is successful
      // and we get a data with the guest's name and a token
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data)
      if (data.success) {
        handleLogin(data.name.name);
        // Save the token to session storage
        sessionStorage.setItem('guestToken', data.token);
        toast({
          title: 'Signin Successful',
          description: `Welcome back, ${sessionStorage.getItem('guestName')}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Signin Failed',
          description: 'Invalid email or password. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error in signin:', error);
      toast({
        title: 'Signin Failed',
        description: 'Failed to signin. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex align="center" justify="center" h="100vh">
      <Box bg="gray.100" p={8} borderRadius="md" shadow="md" width="400px">
        <Heading mb={6}>Guest Signin</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Sign in
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default GuestSigninPage;
