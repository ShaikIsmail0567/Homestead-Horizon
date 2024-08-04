import React, { useState, useEffect } from 'react';
import { Box, Container, Flex, Heading, Image, Text, Wrap, WrapItem, IconButton, Tooltip } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import EditPropertyForm from '../components/properties/EditPropertyForm'; // Import the EditPropertyForm

const MyPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null); // State to manage selected property for editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to manage edit modal

  useEffect(() => {
    // Fetch properties data from backend API
    const fetchProperties = async () => {
      try {
        const response = await axios.get('https://horizon-backend-two.vercel.app/host-properties', {
          headers: {
            Authorization: `${sessionStorage.getItem('token')}`,
          },
        });
        setProperties(response.data.properties);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const handleDeleteProperty = async (propertyId) => {
    try {
        const response = await axios.delete(`https://horizon-backend-two.vercel.app/properties/${propertyId}`, {
          headers: {
            Authorization: `${sessionStorage.getItem('token')}`,
          },
        });
        if (response.status === 200) {
          // Remove the deleted property from the list
          setProperties(properties.filter((property) => property.id !== propertyId));
        }
      } catch (error) {
        console.error('Failed to delete property:', error);
      }
  };

  const handleEditProperty = (propertyId) => {
    // Find the selected property based on the property ID
    const propertyToEdit = properties.find((property) => property.id === propertyId);
    if (propertyToEdit) {
      setSelectedProperty(propertyToEdit);
      setIsEditModalOpen(true); // Open the edit modal
    }
  };

  const handleEditFormClose = () => {
    setIsEditModalOpen(false); // Close the edit modal
    setSelectedProperty(null); // Reset the selected property state
  };

  return (
    <Container maxW="4xl">
      <Box p={8}>
        <Heading as="h1" mb={4}>
          My Properties
        </Heading>
        <Wrap spacing={4}>
          {properties.map((property) => (
            <WrapItem key={property.id} w="30.33%">
               <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
              >
                <Image src={property.picture} alt={property.name} height="200px" width="300px"  objectFit="cover" />
                <Box p={4}>
                  <Text fontWeight="semibold" fontSize="lg" mb={2}>
                    {property.title}
                  </Text>
                  <Text>{property.description}</Text>
                  
                  <Text>Amenities : {property.amenities}</Text>
                  
                  <Flex justify="space-between" mt={4}>
                    <Text>Rooms: {property.rooms}</Text>
                    <Text>Price: ${property.price}</Text>
                  </Flex>
                  <Text>Rating : {property.rating}</Text>
                </Box>
                
              <Flex p={4} justify="space-between">
                <Tooltip label="Edit Property" placement="top">
                  <IconButton
                    icon={<EditIcon />}
                    onClick={() => handleEditProperty(property.id)}
                    aria-label="Edit Property"
                  />
                </Tooltip>
                <Tooltip label="Delete Property" placement="top">
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => handleDeleteProperty(property.id)}
                    aria-label="Delete Property"
                  />
                </Tooltip>
              </Flex>
              </Box>
            </WrapItem>
          ))}
        </Wrap>
      </Box>

      {/* Edit Property Modal */}
      {selectedProperty && (
        <EditPropertyForm
          property={selectedProperty}
          isOpen={isEditModalOpen}
          onClose={handleEditFormClose}
        />
      )}
    </Container>
  );
};

export default MyPropertiesPage;
