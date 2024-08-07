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
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const newStartDateRef = useRef();
  const newEndDateRef = useRef();
  const newRoomsBookedRef = useRef();
  const cancelRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const guestToken = sessionStorage.getItem("guestToken");
        const response = await fetch("https://horizon-backend-two.vercel.app/bookings", {
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

  const handleEditBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    onOpenEditModal();
  };

  const updateBookingDetails = async (
    bookingId,
    newStartDate,
    newEndDate,
    newRoomsBooked
  ) => {
    try {
      const startDate = new Date(newStartDate).toISOString().split("T")[0];
      const endDate = new Date(newEndDate).toISOString().split("T")[0];
      const guestToken = sessionStorage.getItem("guestToken");
      const response = await fetch(
        `https://horizon-backend-two.vercel.app/bookings/${bookingId}`,
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
        alert("Booking Updated Successfully");
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

  const handleUpdateBooking = async (
    bookingId,
    newStartDate,
    newEndDate,
    newRoomsBooked
  ) => {
    try {
      const originalBooking = bookings.find((booking) => booking.id === bookingId);
    const originalEndDate = new Date(originalBooking.end_date);
    const selectedEndDate = new Date(newEndDate);
    const originalRoomsBooked = originalBooking.rooms_booked;
    const originalTotalFare = originalBooking.total_fare;

    let extraDays = 0;
    let extraRooms = 0;

    // Calculate the number of extra days if end_date is extended
    if (selectedEndDate > originalEndDate) {
      extraDays = Math.floor((selectedEndDate - originalEndDate) / (1000 * 60 * 60 * 24));
    }

    // Calculate the number of extra rooms if rooms_booked is increased
    if (newRoomsBooked > originalRoomsBooked) {
      extraRooms = newRoomsBooked - originalRoomsBooked;
    }

    // Calculate the extra amount required to pay based on extra days and extra rooms
    const extraDaysAmount = originalBooking.total_fare * extraDays;
    const extraRoomsAmount = originalBooking.total_fare * extraRooms;
    const totalExtraAmount = extraDaysAmount + extraRoomsAmount;

    // Show the payment modal only if there is an extra amount to be paid
    if (totalExtraAmount > 0) {
      setPaymentAmount(totalExtraAmount);
      setSelectedBookingId(bookingId);
      setShowPaymentModal(true);
    } else {
      // If no extra amount, directly update the booking details
      await updateBookingDetails(bookingId, newStartDate, newEndDate, newRoomsBooked);
    }
      } 
     catch (error) {
      console.error("Error updating booking:", error);
      alert(
        "An error occurred while updating the booking. Please try again later."
      );
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Payment successful, update the booking details
      const bookingId = selectedBookingId;
      const bookingToUpdate = bookings.find((booking) => booking.id === bookingId);
      const newStartDate = new Date(newStartDateRef.current.value).toISOString();
      const newEndDate = new Date(newEndDateRef.current.value).toISOString();
      const newRoomsBooked = parseInt(newRoomsBookedRef.current.value);
  
      await updateBookingDetails(bookingId, newStartDate, newEndDate, newRoomsBooked);
  
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(
        "An error occurred while processing the payment. Please try again."
      );
    }
  };

  const handleDeleteBooking = async () => {
    if (!selectedBookingId) {
      return; // No booking selected for deletion
    }

    try {
      const guestToken = sessionStorage.getItem("guestToken");
      const response = await fetch(
        `https://horizon-backend-two.vercel.app/bookings/${selectedBookingId}`,
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

    onCloseDeleteModal(); // Close the delete confirmation modal
  };

  return (
    <Box p="4">
      <Heading  textAlign="center"size="lg" mb="4">
        Your Bookings
      </Heading>
      <Flex  flexWrap="wrap" justifyContent="space-between">
        {bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <Box
              key={booking.id}
              p="4"
              borderWidth="1px"
              borderRadius="md"
              mb="4"
             
              width={{ base: "100%", md: "48%" }}
              bg="blue.50"
              boxShadow="md"
            >
                <Box  borderRadius="md" p="4" width="100%">
      <Flex align="center" mb="4">
        <Image
          src={booking.property_image}
          alt={booking.property_name}
          height="200px"
          objectFit="cover"
          borderRadius="md"
          mr="4"
        />
        <Box>
          <Text fontSize="xl">Booking ID: {booking.id}</Text>
          <Text mt="2">Property Name: {booking.property_name}</Text>
          <Text mt="2">
            Check-in Date: {new Date(booking.start_date).toLocaleDateString()}
          </Text>
          <Text mt="2">
            Check-out Date: {new Date(booking.end_date).toLocaleDateString()}
          </Text>
          <Text mt="2">Number of Rooms Booked: {booking.rooms_booked}</Text>
          <Text mt="2">Total Fare: ₹ {booking.total_fare}</Text>
          {booking.coupon_code && (
            <>
              <Text mt="2">Coupon Code: {booking.coupon_code}</Text>
              <Text mt="2">Discounted Price: ₹ {booking.discounted_price}</Text>
            </>
          )}
        </Box>
      </Flex>
      <Flex mt="4" justifyContent="space-between" alignItems="center">
        <Link to={`/hotels/${booking.property_id}`}>
          <Button colorScheme="blue">View Details</Button>
        </Link>
        <Box>
          <Button colorScheme="green" onClick={() => handleEditBooking(booking.id)}>
            Edit
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              setSelectedBookingId(booking.id);
              onOpenDeleteModal();
            }}
            ml="2"
          >
            Delete
          </Button>
        </Box>
      </Flex>
    </Box>
              <AlertDialog
                isOpen={isDeleteModalOpen && selectedBookingId === booking.id}
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
                      <Button ref={cancelRef} onClick={onCloseDeleteModal}>
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
            </Box>
          ))
        ) : (
          <Text>No bookings found.</Text>
        )}
      </Flex>
      {showPaymentModal && (
        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Enter Credit Card Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Text mb="4">Amount to Pay: ₹ {paymentAmount}</Text>
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
      )}
      {/* Edit Modal */}
      {selectedBookingId && (
        <Modal isOpen={isEditModalOpen} onClose={onCloseEditModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Booking</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb="4">
                <FormLabel>Check-in Date</FormLabel>
                <Input
                  type="date"
                  defaultValue={
                    bookings.find((booking) => booking.id === selectedBookingId)
                      .start_date
                  }
                  ref={newStartDateRef}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Check-out Date</FormLabel>
                <Input
                  type="date"
                  defaultValue={
                    bookings.find((booking) => booking.id === selectedBookingId)
                      .end_date
                  }
                  ref={newEndDateRef}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Number of Rooms Booked</FormLabel>
                <Input
                  type="number"
                  defaultValue={
                    bookings.find((booking) => booking.id === selectedBookingId)
                      .rooms_booked
                  }
                  ref={newRoomsBookedRef}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="green"
                onClick={() =>
                  handleUpdateBooking(
                    selectedBookingId,
                    newStartDateRef.current.value,
                    newEndDateRef.current.value,
                    newRoomsBookedRef.current.value
                  )
                }
              >
                Update
              </Button>
              <Button ml="4" onClick={onCloseEditModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default BookingsPage;