import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const EditBookingModal = ({ isOpen, onClose, booking, onUpdate }) => {
  const [newStartDate, setNewStartDate] = useState(booking.start_date);
  const [newEndDate, setNewEndDate] = useState(booking.end_date);
  const [newRoomsBooked, setNewRoomsBooked] = useState(booking.rooms_booked);
  const newStartDateRef = useRef(null);
  const newEndDateRef = useRef(null);
  const newRoomsBookedRef = useRef(null);

  const handleUpdateBooking = () => {
    // Perform validation or checks if needed before updating the booking
    onUpdate(
      booking.id,
      newStartDateRef.current.value,
      newEndDateRef.current.value,
      newRoomsBookedRef.current.value
    );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Booking</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb="4">
            <FormLabel>Check-in Date</FormLabel>
            <Input
              type="date"
              value={newStartDate}
              ref={newStartDateRef}
              onChange={(e) => setNewStartDate(e.target.value)}
            />
          </FormControl>
          <FormControl mb="4">
            <FormLabel>Check-out Date</FormLabel>
            <Input
              type="date"
              value={newEndDate}
              ref={newEndDateRef}
              onChange={(e) => setNewEndDate(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Number of Rooms Booked</FormLabel>
            <Input
              type="number"
              value={newRoomsBooked}
              ref={newRoomsBookedRef}
              onChange={(e) => setNewRoomsBooked(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" onClick={handleUpdateBooking}>
            Update
          </Button>
          <Button ml="4" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const guestToken = sessionStorage.getItem("guestToken");
        const response = await fetch("http://localhost:3000/bookings", {
          headers: {
            Authorization: guestToken,
          },
        });
        const data = await response.json();
        setBookings(data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleDeleteBooking = async () => {
    if (!selectedBookingId) {
      return; // No booking selected for deletion
    }

    try {
      const guestToken = sessionStorage.getItem("guestToken");
      const response = await fetch(
        `http://localhost:3000/bookings/${selectedBookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: guestToken,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        // Booking deleted successfully, update the bookings list
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== selectedBookingId)
        );
        setSelectedBookingId(null); // Reset selectedBookingId after successful deletion
      } else {
        console.error("Failed to delete booking:", data);
        alert("Failed to delete booking. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert(
        "An error occurred while deleting the booking. Please try again later."
      );
    }

    setIsDeleteModalOpen(false);  // Close the delete confirmation modal
  };
  const onCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedBookingId(null); // Reset selectedBookingId when the delete modal is closed
  };
  const handleUpdateBooking = async (
    bookingId,
    newStartDate,
    newEndDate,
    newRoomsBooked,
    property,
  ) => {
    try {
      const originalBooking = bookings.find((booking) => booking.id === bookingId);
      const originalEndDate = new Date(originalBooking.end_date);
      const selectedEndDate = new Date(newEndDate);
      if (selectedEndDate > originalEndDate || newRoomsBooked > originalBooking.rooms_booked) {
        // Calculate the number of extra days and payment required
        // console.log(originalBooking,property)
        const extraDays = Math.floor((selectedEndDate - originalEndDate) / (1000 * 60 * 60 * 24));
        const paymentRequired = extraDays * originalBooking.total_fare;
        
        // Set the payment details and open the payment modal
        setSelectedBookingId(bookingId);
        setShowModal(true);
      } else {
        // Proceed with the update directly
        const startDate = new Date(newStartDate).toISOString();
        const endDate = new Date(newEndDate).toISOString();
        await updateBookingDetails(
          bookingId,
          startDate,
          endDate,
          newRoomsBooked
        );
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("An error occurred while updating the booking. Please try again later.");
    }
  };

  const handlePaymentSuccess = async () => {
    // Payment successful, update the booking details
    const bookingId = selectedBookingId;
    const bookingToUpdate = bookings.find((booking) => booking.id === bookingId);
    const newStartDate = bookingToUpdate.start_date;
    const newEndDate = bookingToUpdate.end_date;
    const newRoomsBooked = bookingToUpdate.rooms_booked;

    await updateBookingDetails(
      bookingId,
      newStartDate,
      newEndDate,
      newRoomsBooked
    );

    setShowModal(false);
  };

  const updateBookingDetails = async (
    bookingId,
    newStartDate,
    newEndDate,
    newRoomsBooked
  ) => {
    try {
      const startDate = new Date(newStartDate).toISOString().split('T')[0];
    const endDate = new Date(newEndDate).toISOString().split('T')[0];
      const guestToken = sessionStorage.getItem("guestToken");
      const response = await fetch(
        `http://localhost:3000/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: guestToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start_date: startDate,
            end_date: endDate,
            rooms_booked: newRoomsBooked,
          }),
        }
      );
      const data = await response.json();
        
      if (response.ok) {
        // Booking updated successfully, update the bookings list
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  start_date: newStartDate,
                  end_date: newEndDate,
                  rooms_booked: newRoomsBooked,
                }
              : booking
          )
        );
        alert("Booking Updated Successfully")
      } else {
        console.error("Failed to update booking:", data);
        alert("Failed to update booking. Please try again.");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert(
        "An error occurred while updating the booking. Please try again later."
      );
    }
  };

  return (
    <Box p="4">
      <Heading size="lg" mb="4">
        Your Bookings
      </Heading>
      <Flex flexWrap="wrap" justifyContent="space-between">
        {bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <Box
              key={booking.id}
              p="4"
              borderWidth="1px"
              borderRadius="md"
              mb="4"
              width={{ base: "100%", md: "48%" }}
            >
              <Flex align="center" mb="4">
                <Image
                  src={booking.property_image}
                  alt={booking.property_name}
                  height="150px"
                  objectFit="cover"
                  borderRadius="md"
                  mr="4"
                />
                <Box>
                  <Text fontSize="xl">Booking ID: {booking.id}</Text>
                  <Text mt="2">Property Name: {booking.property_name}</Text>
                </Box>
              </Flex>
              <Box>
                <Text>Check-in Date: {booking.start_date}</Text>
                <Text mt="2">Check-out Date: {booking.end_date}</Text>
                <Text mt="2">
                  Number of Rooms Booked: {booking.rooms_booked}
                </Text>
                <Text mt="2">Total Fare: ₹ {booking.total_fare}</Text>
                {booking.coupon_code && (
                  <>
                    <Text mt="2">Coupon Code: {booking.coupon_code}</Text>
                    <Text mt="2">
                      Discounted Price: ₹ {booking.discounted_price}
                    </Text>
                  </>
                )}
              </Box>
              <Flex mt="4" justifyContent="space-between">
                <Link to={`/hotels/${booking.property_id}`}>
                  <Button colorScheme="blue">View Details</Button>
                </Link>
                <Button
                  colorScheme="green"
                  onClick={() => {
                    setSelectedBookingId(booking.id);
                    onOpen();
                  }}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    setSelectedBookingId(booking.id);
                    isDeleteModalOpen();
                  }}
                >
                  Delete
                </Button>
              </Flex>
              <AlertDialog
                isOpen={isDeleteModalOpen}
                leastDestructiveRef={cancelRef}
                onClose={onCloseDeleteModal}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Delete Booking
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure you want to delete this booking?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        No
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={handleDeleteBooking}
                        ml={3}
                      >
                        Yes
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
              <EditBookingModal
                isOpen={isOpen && selectedBookingId === booking.id}
                onClose={onClose}
                booking={booking}
                onUpdate={handleUpdateBooking}
                property={booking.property}
              />
            </Box>
          ))
        ) : (
          <Text>No bookings found.</Text>
        )}
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
            <Button colorScheme="teal" onClick={handlePaymentSuccess}>
              Pay
            </Button>
            <Button
              colorScheme="gray"
              ml="2"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BookingsPage;
