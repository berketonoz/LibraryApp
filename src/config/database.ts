import { Sequelize } from "sequelize";

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
