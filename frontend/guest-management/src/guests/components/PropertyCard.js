import React from 'react';
import {
  Box,
  Flex,
  Image,
  Badge,
  Heading,
  Text,
  Button,
  useToast,
} from '@chakra-ui/react';

const PropertyCard = ({ property }) => {
  const toast = useToast();

  const handleBook = () => {
    // Replace this function with your booking logic
    // For now, let's just show a toast message when the "Book" button is clicked
    toast({
      title: 'Booking',
      description: `You booked ${property.title}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="4">
      <Image src={property.picture} alt={property.title} height="200px" objectFit="cover" />
      <Box p="4">
        <Heading as="h3" size="md" mb="2">
          {property.title}
        </Heading>
        <Text fontSize="sm" color="gray.500" mb="2">
          {property.location}
        </Text>
        <Text fontSize="md" mb="4">
          {property.description}
        </Text>
        <Flex align="center" justify="space-between">
        <Text fontSize="md" align="center" mb="4">
          Available Rooms : {property.rooms}
        </Text>
          <Badge colorScheme="teal" fontSize="md">
            Price : ${property.price}
          </Badge>
         
        </Flex>
        <Button onClick={handleBook} align="center" colorScheme="blue">
            Book
          </Button>
      </Box>
    </Box>
  );
};

export default PropertyCard;
