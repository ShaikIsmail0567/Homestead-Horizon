import React, { useState, useEffect } from 'react';
import { Box, Input, Textarea, Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';

const EditPropertyForm = ({ property, isOpen, onClose }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });
  const [imageUrl, setImageUrl] = useState('');

  // Set the formData and imageUrl state when the property prop changes (on edit)
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        price: property.price,
        rooms:property.rooms
      });
      setImageUrl(property.picture);
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://horizon-backend-two.vercel.app/properties/${property.id}`, {
        ...formData,
        picture: imageUrl, // Include the updated image URL in the request
      }, {
        headers: {
            Authorization: `${sessionStorage.getItem('token')}`,
        }
    });
      toast({
        title: 'Success',
        description: 'Property updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update property',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Property</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <form onSubmit={handleSubmit}>
              <Input
                name="title"
                placeholder="Title"
                mb={4}
                value={formData.title}
                onChange={handleChange}
              />
              <Textarea
                name="description"
                placeholder="Description"
                mb={4}
                value={formData.description}
                onChange={handleChange}
              />
              <Input
                name="rooms"
                placeholder="Available Rooms"
                mb={4}
                value={formData.rooms}
                onChange={handleChange}
              />
              <Input
                name="price"
                type="number"
                placeholder="Price"
                mb={4}
                value={formData.price}
                onChange={handleChange}
              />
              <Input
                name="imageUrl"
                placeholder="Image URL"
                mb={4}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button type="submit" colorScheme="blue">
                Update Property
              </Button>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditPropertyForm;
