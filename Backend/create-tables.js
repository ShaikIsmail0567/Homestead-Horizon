require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((error) => {
  if (error) {
    console.error('Failed to connect to PlanetScale:', error);
    return;
  }
  console.log('Connected to PlanetScale!');

  // Create the hosts table
 // Create the hosts table
const createHostsTable = `
CREATE TABLE IF NOT EXISTS hosts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
`;

  connection.query(createHostsTable, (error) => {
    if (error) {
      console.error('Failed to create hosts table:', error);
    } else {
      console.log('Hosts table created successfully');
    }
  });

  // Create the properties table
  const createPropertiesTable = `
    CREATE TABLE IF NOT EXISTS properties (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      host_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  connection.query(createPropertiesTable, (error) => {
    if (error) {
      console.error('Failed to create properties table:', error);
    } else {
      console.log('Properties table created successfully');
    }
  });

  // Create the guests table
  const createGuestsTable = `
    CREATE TABLE IF NOT EXISTS guests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  connection.query(createGuestsTable, (error) => {
    if (error) {
      console.error('Failed to create guests table:', error);
    } else {
      console.log('Guests table created successfully');
    }
  });

  // Create the bookings table
  const createBookingsTable = `
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      property_id INT,
      guest_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  connection.query(createBookingsTable, (error) => {
    if (error) {
      console.error('Failed to create bookings table:', error);
    } else {
      console.log('Bookings table created successfully');
    }
  });

  // Create the booking_properties table
  const createBookingPropertiesTable = `
    CREATE TABLE IF NOT EXISTS booking_properties (
      booking_id INT,
      property_id INT
    )
  `;
  connection.query(createBookingPropertiesTable, (error) => {
    if (error) {
      console.error('Failed to create booking_properties table:', error);
    } else {
      console.log('Booking_properties table created successfully');
    }
  });

  // Create the booking_guests table
  const createBookingGuestsTable = `
    CREATE TABLE IF NOT EXISTS booking_guests (
      booking_id INT,
      guest_id INT
    )
  `;
  connection.query(createBookingGuestsTable, (error) => {
    if (error) {
      console.error('Failed to create booking_guests table:', error);
    } else {
      console.log('Booking_guests table created successfully');
    }
  });

  connection.end();
});
