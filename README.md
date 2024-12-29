# Train Booking Backend

## Project Overview

The Train Booking Backend is a backend application designed to manage train bookings, including user authentication, train search, and booking features. This project is built with Node.js, Express, MongoDB, and Mongoose. It includes thorough testing to ensure reliability and is implemented using TypeScript for type safety and better developer experience.

---

## Features

### User Authentication
- Secure user registration and login using Passport.js.
- Session management with express-session and MongoDB store.

### Train Search and Booking
- Search for trains based on route, date, and available seats.
- Book seats on a selected train.
- View, update, and delete bookings.

### Middleware
- Security features using Helmet, cors, express-mongo-sanitize, and hpp.
- Rate limiting to prevent abuse.
- Custom error handling for detailed feedback.
