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

## Folder Structure

The project is organized as follows:

```
├── src/
│   ├── config/            # Configuration file for passport)
│   ├── controllers/       # Route handlers and business logic
│   ├── db/                # Database connection and initialization
│   ├── middleware/        # Custom middleware (e.g., authentication, error handling)
│   ├── models/            # Mongoose schemas and models
│   ├── routes/            # API route definitions
│   ├── utils/             # Utility functions and helpers
│   ├── validators/        # Validation logic for request data
│   ├── app.ts             # Express app setup
│   └── index.ts           # Entry point for the application
├── tests/
│   ├── integration/       # Integration tests for APIs
│   ├── unit/              # Unit tests for individual modules
│   └── mongodb_helper.ts  # Helper for MongoDB test environment setup
└── [config files]         # Project configuration files (e.g., package.json, tsconfig.json, .env)
```

## API Endpoints

### Auth

- **POST** `/auth/login` - Login
- **GET** `/auth/logout` - Logout
- **GET** `/auth/profile` - Get user profile

### Users

- **GET** `/users/:id` - Get user
- **POST** `/users/` - Create user
- **PUT** `/users/:id` - Update user
- **DELETE** `/users/:id` - Delete user

### Trains

- **GET** `/trains/search` - Search trains

### Bookings

- **GET** `/bookings/:id` - Get booking
- **POST** `/bookings/` - Create booking
- **PUT** `/bookings/:id` - Update booking
- **DELETE** `/bookings/:id` - Delete booking
