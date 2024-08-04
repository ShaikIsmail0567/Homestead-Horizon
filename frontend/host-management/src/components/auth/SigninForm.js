import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';

const SigninForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignin = async () => {
    try {
      const response = await axios.post('https://horizon-backend-two.vercel.app/hosts/login', { email, password });
      
        const token = response.data.token;
        sessionStorage.setItem("token", token);
        // console.log(token)
        
        toast({
          title: 'Success',
          description: 'Logged in successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/dashboard');
      
     } catch (error) {
        const errorMessage = error.response?.data?.message;
        if(errorMessage){
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
        Signin
      </Heading>
      <Input placeholder="Email" mb={4} value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input
        type="password"
        placeholder="Password"
        mb={4}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button colorScheme="blue" onClick={handleSignin}>
        Signin
      </Button>
    </Box>
  );
};

export default SigninForm;
