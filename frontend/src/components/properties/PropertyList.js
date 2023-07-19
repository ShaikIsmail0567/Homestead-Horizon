import React from 'react';
import { Box, Grid } from '@chakra-ui/react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties }) => {
  return (
    <Box mt={4}>
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            imageUrl={property.picture}
            name={property.title}
            desc={property.description}
            price={property.price}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default PropertyList;
