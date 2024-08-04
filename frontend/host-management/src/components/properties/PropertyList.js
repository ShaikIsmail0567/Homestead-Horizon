import React, { useState } from 'react';
import { Box, Grid, GridItem, Heading, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import EditPropertyForm from './EditPropertyForm'; // Import the EditPropertyForm

const PropertyCard = ({ property, onEdit, onDelete }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await axios.delete(`https://horizon-backend-two.vercel.app/properties/${property.id}`);
      onDelete(property.id);
      toast({
        title: 'Success',
        description: 'Property deleted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
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
    <GridItem key={property.id}>
      <Box p={4} borderWidth="1px" borderRadius="md" textAlign="center">
        <Heading as="h3" size="md" mb={2}>
          {property.name}
        </Heading>
        <img src={property.imageUrl} alt={property.name} width="100%" height="150px" />
        <Text mt={2}>Price: ${property.price.toFixed(2)}</Text>
        <Button mt={2} colorScheme="teal" size="sm" onClick={onOpen}>
          Edit
        </Button>
        <Button mt={2} colorScheme="red" size="sm" onClick={handleDelete}>
          Delete
        </Button>
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
    </GridItem>
  );
};

const PropertyList = ({ properties, onDelete, onEdit }) => {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onDelete={onDelete}
          onEdit={() => onEdit(property.id)}
        />
      ))}
    </Grid>
  );
};

export default PropertyList;
