import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import PropertyForm from '../components/properties/PropertyForm';

const AddPropertyPage = () => {
  return (
    <Container maxW="lg">
      <Box p={8} borderWidth={1} borderRadius="md">
        <PropertyForm />
      </Box>
    </Container>
  );
};

export default AddPropertyPage;
