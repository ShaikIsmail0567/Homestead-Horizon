import React, { useEffect, useState } from 'react';
import { Box, Container } from '@chakra-ui/react';
import BookingList from '../components/bookings/BookingList';
import axios from 'axios';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = sessionStorage.getItem('token'); // Get the token from session storage
      const response = await axios.get('https://horizon-backend-two.vercel.app/host/bookings', {
        headers: {
          Authorization: `${token}`, // Include the token in the request headers
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  return (
    <Container maxW="lg">
      <Box p={8}>
        <BookingList bookings={bookings} />
      </Box>
    </Container>
  );
};

export default BookingsPage;
