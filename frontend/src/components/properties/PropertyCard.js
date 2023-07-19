import React from 'react';
import { Box, Image, Heading, Text } from '@chakra-ui/react';

const PropertyCard = ({ imageUrl, name, price }) => {
  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image src={imageUrl} alt={name} />
      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {name}
        </Heading>
        <Text fontSize="lg" fontWeight="bold">
          ${price}
        </Text>
      </Box>
    </Box>
  );
};

export default PropertyCard;
