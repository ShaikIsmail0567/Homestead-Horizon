MOTEL
=====

Introduction
------------

This project is a comprehensive hotel management platform that includes both host and guest management systems. It aims to simplify the process of booking and managing hotel accommodations for both hosts and guests. The platform allows hosts to list their properties, manage bookings, and set prices, while guests can browse available properties, make bookings, and view their booking history.

Deployed App
------------

The application is deployed and accessible at: [https://deployed-site.whatever](https://deployed-site.whatever)

Video Walkthrough of the Project
--------------------------------

\[Insert video walkthrough link here\]

Features
--------

### Host Management:

*   Property Listing: Hosts can easily list their properties by providing details such as property name, location, description, and images.
*   Booking Management: Hosts can view and manage their property bookings, including check-in/check-out dates and the number of rooms booked.
*   Pricing Management: Hosts can set custom prices for their properties based on different factors such as seasons, holidays, and weekdays.

### Guest Management:

*   Property Search: Guests can search for available properties based on location, check-in/out dates, and the number of rooms required.
*   Booking Process: Guests can easily book properties by selecting the desired dates and providing payment information.
*   Booking History: Guests can view their booking history and manage their upcoming reservations.

Installation & Getting Started
------------------------------

To run the project locally, follow these steps:

    
    git clone https://github.com/your-username/your-project.git
    cd your-project
    npm install
    npm start
    

Usage
-----

### Host Management:

*   Login as a host using your credentials.
*   List your property by providing property details and images.
*   Manage your bookings and set custom prices for different periods.

### Guest Management:

*   Sign in as a guest using your credentials.
*   Search for available properties based on your preferences.
*   Book a property by selecting the check-in/out dates and providing payment details.
*   View your booking history and upcoming reservations.

Host Management API Endpoints
-----------------------------

    
    GET /api/host/properties - retrieve all properties
    POST /api/host/properties - create a new property
    GET /api/host/properties/:propertyId - retrieve a specific property by ID
    PUT /api/host/properties/:propertyId - update a specific property by ID
    DELETE /api/host/properties/:propertyId - delete a specific property by ID
    GET /api/host/bookings - retrieve all bookings for a host
    GET /api/host/bookings/:bookingId - retrieve a specific booking by ID for a host
    PUT /api/host/bookings/:bookingId - update a specific booking by ID for a host
    DELETE /api/host/bookings/:bookingId - delete a specific booking by ID for a host
    

Guest Management API Endpoints
------------------------------

    
    GET /api/guest/properties - retrieve all properties for guests
    GET /api/guest/properties/:propertyId - retrieve a specific property by ID for guests
    POST /api/guest/bookings - create a new booking for guests
    GET /api/guest/bookings - retrieve all bookings for guests
    GET /api/guest/bookings/:bookingId - retrieve a specific booking by ID for guests
    PUT /api/guest/bookings/:bookingId - update a specific booking by ID for guests
    DELETE /api/guest/bookings/:bookingId - delete a specific booking by ID for guests
    

Technology Stack
----------------

The project is built using the following technologies:

### Frontend:

*   React.js
*   Chakra UI (for UI components)
*   React Router (for routing)
*   Axios (for API calls)

### Backend:

*   Node.js
*   Express.js (for server-side logic)
*   MySQL (as the database)
*   JSON Web Tokens (JWT) (for authentication)

Contact Information
-------------------

For any inquiries or feedback, please contact [sk.mdismail056@gmail.com](mailto:sk.mdismail056@gmail.com).