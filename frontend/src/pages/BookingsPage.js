import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import BookingList from '../components/bookings/BookingList';

const BookingsPage = () => {
  // Fetch bookings data from backend API using useEffect or Redux
  const bookings = [
    { id: 1, propertyName: 'Hotel 1', checkInDate: '2022-01-01', checkOutDate: '2022-01-05', totalFare: 500 },
    { id: 2, propertyName: 'Hotel 2', checkInDate: '2022-02-01', checkOutDate: '2022-02-05', totalFare: 800 },
    { id: 3, propertyName: 'Hotel 3', checkInDate: '2022-03-01', checkOutDate: '2022-03-05', totalFare: 700 },
  ];

  return (
    <Container maxW="lg">
      <Box p={8}>
        <BookingList bookings={bookings} />
      </Box>
    </Container>
  );
};

export default BookingsPage;
