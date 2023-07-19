require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors=require("cors")
const app = express();
app.use(express.json());
app.use(cors())
const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((error) => {
  if (error) {
    console.error('Failed to connect to PlanetScale:', error);
    return;
  }
  console.log('Connected to PlanetScale!');

  // Middleware to verify host token
  const verifyHostToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Access denied.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: 'Invalid token.' });
      }

      req.hostId = decoded.hostId;
      next();
    });
  };

  // Middleware to verify guest token
  const verifyGuestToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Access denied.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: 'Invalid token.' });
      }

      req.userId = decoded.userId;
      req.role = decoded.role;

      if (req.role !== 'guest') {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      next();
    });
  };

  // Register a new host
  app.post('/hosts/register', (req, res) => {
    const { name, email, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (error, hashedPassword) => {
      if (error) {
        console.error('Failed to hash password:', error);
        res.status(500).json({ message: 'Failed to register host' });
        return;
      }

      const query = 'INSERT INTO hosts (name, email, password, role) VALUES (?, ?, ?, ?)';
      const role = 'host'; // Set the role as 'host' for new hosts
      connection.query(query, [name, email, hashedPassword, role], (error) => {
        if (error) {
          console.error('Failed to register host:', error);
          res.status(500).json({ message: 'Failed to register host' });
        } else {
          res.status(201).json({ message: 'Host registered successfully' });
        }
      });
    });
  });

  // Authenticate a host
  app.post('/hosts/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM hosts WHERE email = ?';
    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error('Failed to fetch host:', error);
        res.status(500).json({ message: 'Failed to authenticate host' });
        return;
      }

      if (results.length === 0) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const host = results[0];

      // Compare the password
      bcrypt.compare(password, host.password, (error, isMatch) => {
        if (error) {
          console.error('Failed to compare passwords:', error);
          res.status(500).json({ message: 'Failed to authenticate host' });
        } else if (isMatch) {
          // Passwords match, generate a token
          const token = jwt.sign({ hostId: host.id }, process.env.JWT_SECRET);
          res.status(200).json({ success: true, token });
        } else {
          // Passwords don't match
          res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
      });
    });
  });

  // Register a new user (guest)
  app.post('/users/register', (req, res) => {
    const { name, email, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (error, hashedPassword) => {
      if (error) {
        console.error('Failed to hash password:', error);
        res.status(500).json({ message: 'Failed to register user' });
        return;
      }

      const query = 'INSERT INTO guests (name, email, password, role) VALUES (?, ?, ?, ?)';
      const role = 'guest'; // Set the role as 'guest' for new guests
      connection.query(query, [name, email, hashedPassword, role], (error) => {
        if (error) {
          console.error('Failed to register user:', error);
          res.status(500).json({ message: 'Failed to register user' });
        } else {
          res.status(201).json({ message: 'User registered successfully' });
        }
      });
    });
  });

  // Authenticate a user (guest)
  app.post('/users/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM guests WHERE email = ?';
    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error('Failed to fetch user:', error);
        res.status(500).json({ message: 'Failed to authenticate user' });
        return;
      }

      if (results.length === 0) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const user = results[0];

      // Compare the password
      bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) {
          console.error('Failed to compare passwords:', error);
          res.status(500).json({ message: 'Failed to authenticate user' });
        } else if (isMatch) {
          // Passwords match, generate a token
          const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);
          res.json({ token });
        } else {
          // Passwords don't match
          res.status(401).json({ message: 'Invalid credentials' });
        }
      });
    });
  });

  // Create a new property (hotel)
  app.post('/properties', verifyHostToken, (req, res) => {
    const { title, description, price, picture } = req.body;
    const hostId = req.hostId;

    // Create the property
    const query = 'INSERT INTO properties (host_id, title, description, price, picture) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [hostId, title, description, price, picture], (error) => {
      if (error) {
        console.error('Failed to create property:', error);
        res.status(500).json({ message: 'Failed to create property' });
      } else {
        res.status(201).json({ message: 'Property created successfully' });
      }
    });
  });

  // Get all properties (hotels)
  app.get('/properties', (req, res) => {
    const { location, propertyType, host } = req.query;

    // Construct the SQL query based on the provided search, filter, and sort options
    let query = 'SELECT * FROM properties';
    let conditions = [];
    let values = [];

    if (location) {
      conditions.push('location = ?');
      values.push(location);
    }
    if (propertyType) {
      conditions.push('propertyType = ?');
      values.push(propertyType);
    }
    if (host) {
      conditions.push('host = ?');
      values.push(host);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add sorting options
    const { sortBy } = req.query;
    if (sortBy === 'location') {
      query += ' ORDER BY location ASC';
    } else if (sortBy === 'propertyType') {
      query += ' ORDER BY propertyType ASC';
    }

    // Execute the query
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Failed to fetch properties:', error);
        res.status(500).json({ message: 'Failed to fetch properties' });
      } else {
        res.json(results);
      }
    });
  });

  // Get property details (hotel details)
  app.get('/properties/:property_id', (req, res) => {
    const { property_id } = req.params;

    const query = 'SELECT * FROM properties WHERE id = ?';
    connection.query(query, [property_id], (error, results) => {
      if (error) {
        console.error('Failed to fetch property:', error);
        res.status(500).json({ message: 'Failed to fetch property' });
      } else if (results.length === 0) {
        res.status(404).json({ message: 'Property not found' });
      } else {
        const property = {
          id: results[0].id,
          host_id: results[0].host_id,
          title: results[0].title,
          description: results[0].description,
          price: results[0].price,
          picture: results[0].picture
        };
        res.json(property);
      }
    });
  });

  // Update property details (hotel details)
  app.put('/properties/:property_id', verifyHostToken, (req, res) => {
    const { title, description, price, picture } = req.body;
    const propertyId = req.params.property_id;
    const hostId = req.hostId;

    // Update the property
    const query = 'UPDATE properties SET title = ?, description = ?, price = ?, picture = ? WHERE id = ? AND host_id = ?';
    connection.query(query, [title, description, price, picture, propertyId, hostId], (error, results) => {
      if (error) {
        console.error('Failed to update property:', error);
        res.status(500).json({ message: 'Failed to update property' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Property not found or unauthorized access' });
      } else {
        res.json({ message: 'Property updated successfully' });
      }
    });
  });

  // Delete a property (hotel)
  app.delete('/properties/:property_id', verifyHostToken, (req, res) => {
    const propertyId = req.params.property_id;
    const hostId = req.hostId;

    // Delete the property
    const query = 'DELETE FROM properties WHERE id = ? AND host_id = ?';
    connection.query(query, [propertyId, hostId], (error, results) => {
      if (error) {
        console.error('Failed to delete property:', error);
        res.status(500).json({ message: 'Failed to delete property' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Property not found or unauthorized access' });
      } else {
        res.json({ message: 'Property deleted successfully' });
      }
    });
  });

  // Create a new booking (room booking)
  app.post('/bookings', verifyGuestToken, (req, res) => {
    const { start_date, end_date, property_id } = req.body;
    const guestId = req.userId;

    // Validate inputs
    if (!start_date || !end_date || !property_id) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Check if the property exists and is available for booking
    const propertyQuery = 'SELECT * FROM properties WHERE id = ?';
    connection.query(propertyQuery, [property_id], (error, propertyResults) => {
      if (error) {
        console.error('Failed to fetch property:', error);
        return res.status(500).json({ error: 'Failed to create booking' });
      }

      if (propertyResults.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }

      const property = propertyResults[0];

      // Calculate the number of days between start_date and end_date
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

      if (days <= 0) {
        return res.status(400).json({ error: 'Invalid date range' });
      }

      // Calculate the total fare for the booking
      const totalFare = days * property.price;

      // Check if the property has available rooms for the specified date range
      const bookingQuery = 'SELECT COUNT(*) AS count FROM bookings WHERE property_id = ? AND ((start_date <= ? AND end_date > ?) OR (start_date >= ? AND start_date < ?))';
      connection.query(bookingQuery, [property_id, endDate, startDate, startDate, endDate], (error, bookingResults) => {
        if (error) {
          console.error('Failed to check property availability:', error);
          return res.status(500).json({ error: 'Failed to create booking' });
        }

        const count = bookingResults[0].count;
        const availableRooms = property.rooms - count;

        if (availableRooms <= 0) {
          return res.status(400).json({ error: 'No available rooms for the selected date range' });
        }

        // Create the booking
        const insertQuery = 'INSERT INTO bookings (start_date, end_date, property_id, guest_id, total_fare) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertQuery, [start_date, end_date, property_id, guestId, totalFare], (error, result) => {
          if (error) {
            console.error('Failed to create booking:', error);
            return res.status(500).json({ error: 'Failed to create booking' });
          }

          const bookingId = result.insertId;
          res.status(201).json({ bookingId, totalFare, message: 'Booking created successfully' });
        });
      });
    });
  });

  // Get booking details
  app.get('/bookings/:booking_id', verifyGuestToken, (req, res) => {
    const bookingId = req.params.booking_id;
    const guestId = req.userId;

    // Retrieve booking details for the specified booking_id and guest_id
    const query = 'SELECT * FROM bookings WHERE id = ? AND guest_id = ?';
    connection.query(query, [bookingId, guestId], (error, results) => {
      if (error) {
        console.error('Failed to fetch booking details:', error);
        return res.status(500).json({ error: 'Failed to fetch booking details' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const bookingDetails = results[0];
      res.status(200).json({ booking: bookingDetails });
    });
  });

  // Update booking details
  app.put('/bookings/:booking_id', verifyGuestToken, (req, res) => {
    const bookingId = req.params.booking_id;
    const { start_date, end_date } = req.body;
    const guestId = req.userId;

    // Validate inputs
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Check if the booking exists and belongs to the authenticated guest
    const bookingQuery = 'SELECT * FROM bookings WHERE id = ? AND guest_id = ?';
    connection.query(bookingQuery, [bookingId, guestId], (error, bookingResults) => {
      if (error) {
        console.error('Failed to fetch booking:', error);
        return res.status(500).json({ error: 'Failed to update booking' });
      }

      if (bookingResults.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Update the booking details
      const updateQuery = 'UPDATE bookings SET start_date = ?, end_date = ? WHERE id = ?';
      connection.query(updateQuery, [start_date, end_date, bookingId], (error) => {
        if (error) {
          console.error('Failed to update booking:', error);
          return res.status(500).json({ error: 'Failed to update booking' });
        }

        res.status(200).json({ message: 'Booking updated successfully' });
      });
    });
  });

  // Delete a booking
  app.delete('/bookings/:booking_id', verifyGuestToken, (req, res) => {
    const bookingId = req.params.booking_id;
    const guestId = req.userId;

    // Delete the booking
    const query = 'DELETE FROM bookings WHERE id = ? AND guest_id = ?';
    connection.query(query, [bookingId, guestId], (error, result) => {
      if (error) {
        console.error('Failed to delete booking:', error);
        return res.status(500).json({ error: 'Failed to delete booking' });
      }

      res.status(200).json({ message: 'Booking deleted successfully' });
    });
  });

  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
});
