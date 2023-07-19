import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';

const PropertyForm = () => {
  const history = useNavigate();
  const toast = useToast();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleAddProperty = async () => {
    try {
      const response = await axios.post('/properties', { name, price });
      toast({
        title: 'Success',
        description: 'Property added successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      history.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response.data.error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Add Property
      </Heading>
      <Input placeholder="Name" mb={4} value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Price" mb={4} value={price} onChange={(e) => setPrice(e.target.value)} />
      <Button colorScheme="blue" onClick={handleAddProperty}>
        Add Property
      </Button>
    </Box>
  );
};

export default PropertyForm;
