import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Input,
  Button,
  VStack,
  Select,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react';
import PropertyCard from '../components/PropertyCard';

const DashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
  });

  // Fetch properties from the backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:3000/properties');
        const data = await response.json();
        console.log(data)
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on search term and filters
  const filteredProperties = properties.filter((property) => {
    const locationMatch =
      property.location && property.location.toLowerCase().includes(filters.location.toLowerCase());

    const minPriceMatch = filters.minPrice === '' || property.price >= parseInt(filters.minPrice, 10);
    const maxPriceMatch = filters.maxPrice === '' || property.price <= parseInt(filters.maxPrice, 10);

    return locationMatch && minPriceMatch && maxPriceMatch;
  });

  // Clear the search term and filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <Box p="4">
      <Grid templateColumns="1fr 3fr" gap="4">
        <Box>
          <VStack spacing="4" align="stretch">
            <FormControl>
              <FormLabel>Filter by Location</FormLabel>
              <Input
                type="text"
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Filter by Price Range</FormLabel>
              <Input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
              <FormHelperText>Leave empty to include all prices.</FormHelperText>
            </FormControl>
            <FormControl>
              <Input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
              <FormHelperText>Leave empty to include all prices.</FormHelperText>
            </FormControl>
            <Button onClick={clearFilters} colorScheme="teal">
              Clear Filters
            </Button>
          </VStack>
        </Box>
        <GridItem>
          <Input
            type="text"
            placeholder="Search by hotel name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
