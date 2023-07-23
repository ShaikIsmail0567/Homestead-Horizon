import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';

const PropertyForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [title, settitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [picture, setPicture] = useState('');
  const [rooms, setRooms] = useState('');

  const handleAddProperty = async () => {
    try {
      const response = await axios.post('http://localhost:3000/properties', { title, description, price, picture, rooms }, {
        headers: {
            Authorization: `${sessionStorage.getItem('token')}`,
        }
    });
      toast({
        title: 'Success',
        description: 'Property added successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      console.log(response)
      navigate('/dashboard');
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
      <Input placeholder="title" mb={4} value={title} onChange={(e) => settitle(e.target.value)} />
      <Input
        placeholder="Description"
        mb={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input placeholder="Price" mb={4} value={price} onChange={(e) => setPrice(e.target.value)} />
      <Input placeholder="Picture" mb={4} value={picture} onChange={(e) => setPicture(e.target.value)} />
      <Input placeholder="Rooms" mb={4} value={rooms} onChange={(e) => setRooms(e.target.value)} />
      <Button colorScheme="blue" onClick={handleAddProperty}>
        Add Property
      </Button>
    </Box>
  );
};

export default PropertyForm;
