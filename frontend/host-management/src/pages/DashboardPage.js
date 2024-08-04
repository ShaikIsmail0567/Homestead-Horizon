import React, { useState, useEffect } from 'react';
import { Box, Container, Flex, Heading, Image, Text, Wrap, WrapItem } from '@chakra-ui/react';
import axios from 'axios';

const DashboardPage = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Fetch properties data from backend API
    const fetchProperties = async () => {
      try {
        const response = await axios.get('https://horizon-backend-two.vercel.app/host-properties', {
          headers: {
            Authorization: `${sessionStorage.getItem('token')}`,
          },
        });
        console.log(response.data.properties)
        setProperties(response.data.properties);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      }
    };

    fetchProperties();
  }, []);

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
                  <Flex justify="space-between" mt={4}>
                    <Text>Rooms: {property.rooms}</Text>
                    <Text>Price: ${property.price}</Text>
                  </Flex>
                </Box>
              </Box>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </Container>
  );
};

export default DashboardPage;
