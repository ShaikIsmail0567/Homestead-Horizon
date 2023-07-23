import React from 'react';
import { Box, List, ListItem, Heading, Text } from '@chakra-ui/react';

const BookingList = ({ bookings }) => {
  return (
    <Box mt={4}>
      <Heading as="h2" size="lg" mb={4} textAlign="center">
        Bookings
      </Heading>
      <List spacing={3}>
        {bookings.map((booking) => (
          <ListItem key={booking.id} borderWidth="1px" borderRadius="md" p={4} boxShadow="md" textAlign="center">
            <Box>
              <img src={booking.property_image} alt={booking.property_name} style={{ width: '100%', marginBottom: '8px' }} />
              <Heading as="h3" size="md" mb={2}>
                {booking.property_name}
              </Heading>
              <Text>Guest Name: {booking.name}</Text>
              <Text>Phone Number: {booking.number}</Text>
              <Text>Check-in Date: {new Date(booking.start_date).toLocaleDateString()}</Text>
              <Text>Check-out Date: {new Date(booking.end_date).toLocaleDateString()}</Text>
              <Text>Total Fare: ${Number(booking.total_fare).toFixed(2)}</Text>
              <Text>couponCode: {booking.coupon_code}</Text>
              <Text>Rooms Booked: {booking.rooms_booked}</Text>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BookingList;
