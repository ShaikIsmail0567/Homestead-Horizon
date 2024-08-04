// PropertyCard.js
import React, { useState } from 'react';
import { Box, Image, Heading, Text, Flex, Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import EditPropertyForm from './EditPropertyForm'; // Import the EditPropertyForm

const PropertyCard = ({ property, onDelete, onEdit }) => { // Pass onEdit as a prop
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://horizon-backend-two.vercel.app/properties/${property.id}`);
      if (response.data.message === 'Property deleted successfully') {
        onDelete(property.id);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image src={property.imageUrl} alt={property.name} />
      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {property.name}
        </Heading>
        <Heading as="h5" size="md" mb={2}>
          {property.desc}
        </Heading>
        <Text fontSize="lg" fontWeight="bold">
          ${property.price}
        </Text>
        <Flex mt={4} justify="space-between">
          <Button colorScheme="teal" onClick={onEdit}> {/* Call onEdit when the "Edit" button is clicked */}
            Edit
          </Button>
          <Button colorScheme="red" onClick={handleDelete}>
            Delete
          </Button>
        </Flex>
      </Box>
      {/* Edit Property Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Property</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditPropertyForm property={property} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PropertyCard;
