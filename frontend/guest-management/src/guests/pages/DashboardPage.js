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
  Flex,
  Checkbox,
  CheckboxGroup,
  Wrap,
  WrapItem,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import PropertyCard from '../components/PropertyCard';

const DashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    numRooms: '',
    amenities: [],
    rating: 0,
  });

  // Fetch properties from the backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:3000/properties');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, [filters, searchTerm]);

  // Filter properties based on search term and filters
  const filteredProperties = properties.filter((property) => {
    const locationMatch =
      filters.location === '' ||
      (property.location?.toLowerCase().includes(filters.location.toLowerCase()) || false);
  
    const minPriceMatch = filters.minPrice === '' || property.price >= parseInt(filters.minPrice, 10);
    const maxPriceMatch = filters.maxPrice === '' || property.price <= parseInt(filters.maxPrice, 10);
  
    const nameMatch =
      searchTerm.trim() === '' || property.title.toLowerCase().includes(searchTerm.toLowerCase());
      const numRoomsMatch =
      filters.numRooms === '' || (Number.isInteger(property.rooms) && property.rooms === parseInt(filters.numRooms, 10));
  
      const amenitiesMatch =
      filters.amenities.length === 0 ||
      filters.amenities.every((amenity) => property.amenities?.includes(amenity) ?? false);
  
    const ratingMatch = filters.rating === 0 || property.rating >= filters.rating;
  
    return (
      locationMatch &&
      minPriceMatch &&
      maxPriceMatch &&
      nameMatch &&
      numRoomsMatch &&
      amenitiesMatch &&
      ratingMatch
    );
  });
  

  // Clear the search term and filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      numRooms: '',
      amenities: [],
      rating: 0,
    });
  };

  const amenitiesOptions = ['Wi-Fi', 'Pool', 'Gym', 'Spa', 'Restaurant'];

  return (
    <Box p="4">
      <Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap="4">
        <Box mb="4" display={{ md: 'none' }}>
          {/* Search bar for mobile view */}
          <Input
            type="text"
            placeholder="Search by hotel name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Box>
          <VStack spacing="4" align="stretch">
            {/* Filter options */}
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
              <Flex align="center">
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
                <FormHelperText mx="2">to</FormHelperText>
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </Flex>
              <FormHelperText>Leave empty to include all prices.</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Number of Rooms</FormLabel>
              <Input
                type="number"
                placeholder="Enter number of rooms"
                value={filters.numRooms}
                onChange={(e) => setFilters({ ...filters, numRooms: e.target.value })}
              />
              <FormHelperText>Leave empty to include all properties.</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Filter by Amenities</FormLabel>
              <CheckboxGroup
                colorScheme="teal"
                value={filters.amenities}
                onChange={(values) => setFilters({ ...filters, amenities: values })}
              >
                <Wrap spacing="4">
                  {amenitiesOptions.map((amenity) => (
                    <WrapItem key={amenity}>
                      <Checkbox value={amenity}>{amenity}</Checkbox>
                    </WrapItem>
                  ))}
                </Wrap>
              </CheckboxGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Filter by Rating</FormLabel>
              <Slider
                aria-label="rating-slider"
                min={0}
                max={5}
                step={0.5}
                value={filters.rating}
                onChange={(value) => setFilters({ ...filters, rating: value })}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <FormHelperText>{filters.rating.toFixed(1)}</FormHelperText>
            </FormControl>
            {/* Search button */}
            <Button onClick={clearFilters} colorScheme="teal">
              Search
            </Button>
            {/* Clear Filters button for mobile view */}
            <Button onClick={clearFilters} colorScheme="teal" display={{ base: 'block', md: 'none' }}>
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
            display={{ base: 'none', md: 'block' }}
          />
          {/* Properties displayed in a grid */}
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap="4">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </Grid>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
