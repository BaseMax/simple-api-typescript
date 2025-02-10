# Simple API in TypeScript

A lightweight and minimal REST API built with TypeScript, Express, and SQLite.

## Features

- Express.js for handling API routes
- SQLite3 as the database (without Prisma)
- TypeScript for type safety
- Supertest and Bun.js for testing

## Installation

**Ensure you have the following installed:**

- Node.js (>=16)
- Bun (for testing, optional)

**Clone the Repository:**

```
git clone https://github.com/BaseMax/simple-api-typescript.git
cd simple-api-typescript
```

**Install Dependencies**

```
npm install
```

## Usage

**Start the Server:**

```
npm run dev
```

This will start the API on `http://localhost:3000`.

**Run Tests:**

```
bun test
```

## API Endpoints

### Create a User

POST /users

Request Body:
```
{
  "name": "John Doe",
  "email": "johndoe@example.com"
}
```

### Get All Users

GET /users

### Get a User by ID

GET /users/:id

### Delete a User

DELETE /users/:id

## License

This project is licensed under the MIT License.

Copyright (c) 2025 BaseMax
