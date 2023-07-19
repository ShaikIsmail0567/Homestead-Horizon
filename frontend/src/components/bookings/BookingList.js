import React from 'react';
import { Box, List, ListItem, Heading, Text } from '@chakra-ui/react';

const BookingList = ({ bookings }) => {
  return (
    <Box mt={4}>
      <Heading as="h2" size="lg" mb={4}>
        Bookings
      </Heading>
      <List spacing={3}>
        {bookings.map((booking) => (
          <ListItem key={booking.id}>
            <Text>{booking.propertyName}</Text>
            <Text>{booking.checkInDate}</Text>
            <Text>{booking.checkOutDate}</Text>
            <Text>Total Fare: ${booking.totalFare}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BookingList;
