import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import PropertyList from '../components/properties/PropertyList';

const DashboardPage = () => {
  // Fetch properties data from backend API using useEffect or Redux
  const properties = [
    { id: 1, imageUrl: 'https://example.com/image1.jpg', name: 'Hotel 1', price: 100 },
    { id: 2, imageUrl: 'https://example.com/image2.jpg', name: 'Hotel 2', price: 200 },
    { id: 3, imageUrl: 'https://example.com/image3.jpg', name: 'Hotel 3', price: 300 },
  ];

  return (
    <Container maxW="lg">
      <Box p={8}>
        <Heading as="h1" mb={4}>
          My Properties
        </Heading>
        <PropertyList properties={properties} />
      </Box>
    </Container>
  );
};

export default DashboardPage;
