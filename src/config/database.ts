import { Sequelize } from "sequelize";

// Log environment variables for debugging
console.log("Database Connection Parameters:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

const sequelize = new Sequelize(
  process.env.DB_NAME || "library_management",       // Database name
  process.env.DB_USER || "root",       // Username
  process.env.DB_PASSWORD || "rootroot",   // Password
  {
    host: process.env.DB_HOST || "localhost", // Hostname
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, // Port number
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;
