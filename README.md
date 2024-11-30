# Library Management Application

This is a Library Management System built using **Node.js**, **Express**, **Sequelize**, **MySQL**, and containerized with **Docker**. The application enables management of users and books, along with borrowing and returning books.

## Features

- **User Management**: Create and list users.
- **Book Management**: Create and list books.
- **Borrowing and Returning Books**: Users can borrow books and return them with ratings.

## Getting Started

Follow the steps below to clone the repository and start the application using Docker.

### Prerequisites

- Docker and Docker Compose installed on your system.

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone <repository-url>
cd LibraryApp
```

### 2. Set Up Environment Variables

Create a **.env** file in the root directory to configure the database and application settings. Example **.env** file:

```dotenv
DB_HOST=mysql_container
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_NAME=library_db
```

Ensure the variables match those in the **docker-compose.yml** file.

### 3. Start the Application with Docker

Build and start the containers using Docker Compose:

```bash
docker-compose up --build
```

This will:

- Build the Node.js application image.
- Start the `app` service (Node.js application).
- Start the `db_container` service (MySQL database).

### 4. Verify the Application

Once the containers are running, verify that the app is accessible:

- **API**: Open your browser or an API testing tool (e.g., Postman) and visit:

    ```url
    http://localhost:3000
    ```

- **Database**: Log into the MySQL container to access the database:

    ```bash
    docker exec -it mysql_container mysql -u root -p library_management
    ```

    Enter the password specified in your **.env** file to connect to the database.

## File Structure

```bash
LibraryApp/
├── src/                # Source code
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── controllers/    # Endpoint logic
│   └── server.ts       # App entry point
├── Dockerfile          # Dockerfile for Node.js app
├── docker-compose.yml  # Docker Compose configuration
├── .env.example        # Example environment variables
├── package.json        # Dependencies and scripts
└── README.md           # Documentation
```

## License

See the [LICENSE](./LICENSE) file for details.
