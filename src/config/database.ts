import { Sequelize } from "sequelize";
import User from "../models/User";
import Book from "../models/Book.ts";
import Borrow from "../models/Borrow.ts";

const sequelize = new Sequelize("library_management", "root", "Joe17814..", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});


// Define associations
Borrow.belongsTo(User, { foreignKey: "user_id", as: "user" });
Borrow.belongsTo(Book, { foreignKey: "book_id", as: "book" });
User.hasMany(Borrow, { foreignKey: "user_id", as: "borrows" });
Book.hasMany(Borrow, { foreignKey: "book_id", as: "borrows" });

export default sequelize;
