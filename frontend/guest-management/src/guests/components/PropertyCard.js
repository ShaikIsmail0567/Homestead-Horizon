import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Image,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

const PropertyCard = ({ property }) => {
  const cardBgColor = useColorModeValue('white', 'gray.800');
//   console.log('Property:', property);
  return (
    <Link to={`/hotels/${property.id}`}>
    <Box
      p="4"
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      bgColor={cardBgColor}
      width="100%"
    >
      <Image
        src={property.picture} // Replace with the URL of the property image
        alt={property.title} // Replace with the title of the property
        height="200px"
        objectFit="cover"
        borderRadius="md"
      />
      <Flex align="center" justify="space-between" mt="2">
        <Heading size="md" fontWeight="semibold">
          {property.title}
        </Heading>
        <Text fontSize="md" color="gray.600">
          {property.location}
        </Text>
      </Flex>
     
      <Text mt="2" fontSize="md">
        {property.description}
      </Text>
      <Flex align="center" justify="space-between" mt="2">
        <Text size="md" >
          Amenities : {property.amenities}
        </Text>
        
      </Flex>
      <Text fontSize="md">
          Rating: {property.rating}
        </Text>
      <Flex align="center" justify="space-between" mt="2">
        <Text fontSize="md">
          Rooms: {property.rooms}
        </Text>
        <Text fontSize="md">
          Price: {property.price} INR
        </Text>
      </Flex>
      <Button mt="4" colorScheme="teal">
        Book Now
      </Button>
    </Box>
    </Link>
  );
};

export default PropertyCard;
