import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';

const SignupForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('https://horizon-backend-two.vercel.app/hosts/register', { name, email, password });
      toast({
        title: 'Success',
        description: response.data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/signin');
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Signup
      </Heading>
      <Input placeholder="Name" mb={4} value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Email" mb={4} value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input
        type="password"
        placeholder="Password"
        mb={4}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button colorScheme="blue" onClick={handleSignup}>
        Signup
      </Button>
    </Box>
  );
};

export default SignupForm;
