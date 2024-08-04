import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Flex,
    Image,
    Heading,
    Text,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    FormHelperText,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
  } from '@chakra-ui/react';

const HotelDetailsPage = ({ match }) => {
    const [showModal, setShowModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const COUPON_CODE = "NEWUSER";
  const DISCOUNT_PERCENTAGE = 20;    

  const { property_id } = useParams();
  const [property, setProperty] = useState({});
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    start_date: '',
    end_date: '',
    rooms_booked: 1,
    couponCode: '',
    discountedPrice: 0,
  });

  const calculateDiscountedPrice = () => {
    const { couponCode } = bookingDetails;
    const couponDiscount = couponCode === 'NEWUSER' ? 0.2 : 0; // 20% discount for 'NEWUSER' coupon code

    // Calculate the discounted price
    const discountedPrice = property.price * (1 - couponDiscount);
    setBookingDetails({ ...bookingDetails, discountedPrice });
  };
  const handlePayment = async (e) => {
    e.preventDefault();
    // Validate credit card details (this is a dummy validation, real validation should be done with a payment gateway)
    if (!cardNumber || !expiryMonth || !expiryYear || !cvv) {
      alert('Please fill in all the credit card details.');
      return;
    }

    try {
      // Simulate payment process (set a timeout to simulate an asynchronous operation)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // After payment is successful, proceed with booking
      handleFormSubmit(e);
      setShowModal(false); // Close the modal after payment
    } catch (error) {
      console.error('Error during payment:', error);
      alert('Payment failed. Please try again.');
    }
  };
  const applyCouponCode = () => {
    const { couponCode } = bookingDetails;
    if (couponCode === COUPON_CODE) {
      // Calculate discounted price if the coupon code is valid
      const totalFare = bookingDetails.rooms_booked * property.price;
      const discountedPrice = (totalFare * (100 - DISCOUNT_PERCENTAGE)) / 100;
      setDiscountedPrice(discountedPrice);
    } else {
      // Reset the discounted price if the coupon code is invalid
      setDiscountedPrice(0);
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`https://horizon-backend-two.vercel.app/properties/${property_id}`);
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchProperty();
  }, [property_id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let totalFare = bookingDetails.rooms_booked * property.price;
      let discountedPrice = totalFare;
  
      // Check if the guest has entered a valid coupon code
      if (bookingDetails.couponCode === COUPON_CODE) {
        discountedPrice = (totalFare * (100 - DISCOUNT_PERCENTAGE)) / 100;
      }
      setDiscountedPrice(discountedPrice);
      const response = await fetch('https://horizon-backend-two.vercel.app/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${sessionStorage.getItem("guestToken")}`
        },
        body: JSON.stringify({
          property_id: property_id,
          start_date: bookingDetails.start_date,
          end_date: bookingDetails.end_date,
          rooms_booked: bookingDetails.rooms_booked,
          couponCode: bookingDetails.couponCode,
          discountedPrice: discountedPrice,
          name:bookingDetails.name,
          number:bookingDetails.number,
        }),
      });
      const data = await response.json();
  
      // Check if the booking was successful
      if (response.ok) {
        // Booking successful, redirect to payment page or show success message
        console.log('Booking successful:', data);
  
        // Redirect to the payment page or show a success message
        // Replace the following line with your desired logic:
        alert('Booking successful.');
      } else {
        // Booking failed, show error message
        console.error('Booking failed:', data);
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error booking the hotel:', error);
      // Handle any errors during the booking process
      alert('An error occurred while booking. Please try again later.');
    }
  };
  

  return (
    <Box p="4">
      <Flex flexWrap="wrap">
        {/* Hotel details */}
        <Box width={{ base: '100%', md: '50%' }} p="4">
          <Image src={property.picture} alt={property.title} height="300px" objectFit="cover" borderRadius="md" />
          <Heading size="lg" mt="4">
            {property.title}
          </Heading>
          <Text fontSize="md" color="gray.600">
            {property.location}
          </Text>
          <Text mt="2" fontSize="md">
            {property.description}
          </Text>
          <Flex align="center" justify="space-between" mt="2">
            <Text fontSize="md">Rooms: {property.rooms}</Text>
            <Text fontSize="md">Price: {property.price} INR</Text>
          </Flex>
        </Box>
        {/* Booking form */}
        <Box width={{ base: '100%', md: '50%' }} p="4">
          <form onSubmit={handleFormSubmit}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your name"
                value={bookingDetails.name}
                onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Mobile Number</FormLabel>
              <Input
                type="text"
                placeholder="Enter your mobile number"
                value={bookingDetails.number}
                onChange={(e) => setBookingDetails({ ...bookingDetails, number: e.target.value })}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Check-in Date</FormLabel>
              <Input
                type="date"
                value={bookingDetails.start_date}
                onChange={(e) => setBookingDetails({ ...bookingDetails, start_date: e.target.value })}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Check-out Date</FormLabel>
              <Input
                type="date"
                value={bookingDetails.end_date}
                onChange={(e) => setBookingDetails({ ...bookingDetails, end_date: e.target.value })}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Number of Rooms</FormLabel>
              <Select
                value={bookingDetails.rooms_booked}
                onChange={(e) => setBookingDetails({ ...bookingDetails, rooms_booked: e.target.value })}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Coupon Code</FormLabel>
              <Flex>
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  value={bookingDetails.couponCode}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, couponCode: e.target.value })}
                />
                <Button ml="2" onClick={applyCouponCode} colorScheme="teal">
                  Apply
                </Button>
              </Flex>
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Total Price</FormLabel>
              <Input type="text" value={`₹ ${discountedPrice || (bookingDetails.rooms_booked * property.price)}`} isReadOnly />
              <FormHelperText>{discountedPrice ? "Discounted Price after applying the coupon code." : "Original Price (no coupon applied)"}</FormHelperText>
            </FormControl>
            <Button mt="4" type="button" onClick={() => setShowModal(true)} colorScheme="teal">
              Confirm Booking & Pay
            </Button>
          </form>
        </Box>
      </Flex>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Credit Card Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Card Number</FormLabel>
              <Input
                type="text"
                placeholder="Enter card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </FormControl>
            <Flex mt="4">
              <FormControl flex="1" mr="2">
                <FormLabel>Expiry Month</FormLabel>
                <Input
                  type="text"
                  placeholder="MM"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                />
              </FormControl>
              <FormControl flex="1" mr="2">
                <FormLabel>Expiry Year</FormLabel>
                <Input
                  type="text"
                  placeholder="YY"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                />
              </FormControl>
              <FormControl flex="1">
                <FormLabel>CVV</FormLabel>
                <Input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handlePayment}>
              Pay
            </Button>
            <Button colorScheme="gray" ml="2" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default HotelDetailsPage;
