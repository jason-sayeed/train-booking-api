# Train Booking API

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation Instructions](#installation-instructions)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Run Tests](#run-tests)
- [Technologies Used](#technologies-used)
- [FAQs](#faqs)

---

## Project Overview

The Train Booking API is a backend application designed to manage train bookings, including user authentication, train
search, and booking features. This project is built with Node.js, Express, MongoDB, and Mongoose. It includes thorough
testing to ensure reliability and is implemented using TypeScript for type safety and better developer experience.

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

---

## Prerequisites

To run and develop this project, ensure you have the following installed:

### Required

- **Node.js**: >=20.0.0 (https://nodejs.org/)
- **npm**: >=7.0.0 or **Yarn**: >=1.22.0
- **MongoDB**: >=5.0 (Local or hosted on MongoDB Atlas)

### Recommended for Development

- **TypeScript**: >=5.7.0
- **ESLint**: >=9.16.0
- **Prettier**: >=3.4.0
- **Jest**: >=29.7.0 (for running tests)

### Optional

- **Postman** or **cURL**: For testing the API endpoints.

---

## Installation Instructions

Follow these steps to set up the project locally:

### 1. Clone the Repository

Clone the project repository to your local machine using the following command:

```
git clone https://github.com/jason-sayeed/train-booking-api.git
cd train-booking-api
```

### 2. Install Dependencies

Install the required dependencies using npm:

```
npm install
```

### 3. Configure Environment Variables

Set up the ```.env``` file in the root directory with the following variables:

```
MONGODB_URL=<your-mongodb-connection-string>
NODE_ENV=development
SESSION_SECRET=<your-session-secret>
PORT=<your-port>
```

For testing, create a ```.env.test``` file with the following:

```
NODE_ENV=test
MONGODB_URL=<your-mongodb-connection-string>
PORT=<your-port>
```

Replace \<your-mongodb-connection-string> and \<your-session-secret> and \<your-port> with appropriate values.

### 4. Set Up the Database

Manually create a MongoDB database to use with the application. You can use MongoDB Atlas or a locally installed MongoDB
instance.

Optionally, seed initial data into the database (if needed). Add instructions or scripts for seeding if applicable.

### 5. Run the Application

Start the application in development mode:

```
npm run dev
```

This will use ```nodemon``` and ```tsc``` to automatically rebuild and restart the server on code changes.
To build and run the application in production mode:

```
npm run build
npm start
```

The server will be accessible at ```http://localhost:<PORT>``` (default: ```3000```).

### 6. Linting

To check code quality using ESLint, run:

```
npm run lint
```

---

## Folder Structure

The project is organized as follows:

```
├── src/
│   ├── config/            # Configuration files (e.g., passport configuration)
│   ├── controllers/       # Contains route handlers and business logic (e.g., creating, updating, deleting bookings)
│   ├── db/                # Database connection and initialisation
│   ├── middleware/        # Custom middleware (e.g., authentication, request validation, error handling)
│   ├── models/            # Mongoose schemas and models (e.g., User, Booking)
│   ├── routes/            # API route definitions (e.g., user and booking endpoints)
│   ├── utils/             # Utility functions and helpers (e.g., error handling, response formatting)
│   ├── validators/        # Validation logic for request data (e.g., user input validation)
│   ├── app.ts             # Express app setup and configuration
│   └── index.ts           # Entry point for the application
├── tests/
│   ├── integration/       # Integration tests for APIs (testing multiple components together)
│   ├── unit/              # Unit tests for individual modules and functions
│   └── mongodb_helper.ts  # Helper for setting up and tearing down MongoDB in-memory instances for testing
└── [project files]        # Project configuration files (e.g., package.json, tsconfig.json, .env)
```

---

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

---

## Run Tests

The project uses jest and mongodb-memory-server for testing. Run tests with the following commands:

- Run all tests:

```
npm test
```

- Run tests in watch mode:

```
npm run test:watch
```

The mongodb-memory-server is configured in mongodb-helper.ts to use an in-memory MongoDB instance for testing.

If you want to see test coverage while running tests, update the ```jest.config.ts``` file by setting the
```collectCoverage```
property to ```true``` and saving the file:

```typescript
collectCoverage: true
```

After making this change, running npm test will also display the test coverage report.

---

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: A framework for building web applications and APIs in Node.js
- **TypeScript**: Strongly typed extension of JavaScript.
- **MongoDB**: NoSQL database.
- **Mongoose**: Data modeling for MongoDB in Node.js.
- **Passport.js**: Authentication middleware.
- **Jest**: Testing framework.
- **ESLint**: Linter for identifying and fixing problematic code.
- **Prettier**: Code formatter for consistent styling.

---

## FAQs

### 1. How do I resolve a MongoDB connection error?

Ensure your `MONGODB_URL` in the `.env` file points to a valid MongoDB instance. If using MongoDB Atlas, ensure the IP
address is whitelisted.

### 2. Why do tests fail during setup?

Ensure `mongodb-memory-server` is installed, and the test environment variables are correctly set in the `.env.test`
file.

---

## Future Improvements

Here are some potential features and enhancements that could be added in the future:

- **Advanced Search Filters**: Allow users to search by price range and departure time.
- **Notifications**: Add email or SMS notifications for booking confirmations and updates.
- **Payment Integration**: Implement a payment gateway for booking tickets.
- **Improved Testing**: Expand test coverage to include more edge cases and stress tests.
- **Containerization**: Use Docker for easier deployment and environment setup.

---