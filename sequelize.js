import { Sequelize } from "sequelize";
import defineUser from "./models/User.js";
import defineBook from "./models/Book.js";
import defineBorrow from "./models/Borrow.js";

const sequelize = new Sequelize("library_management", "root", "Joe17814..", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// Initialize models
const User = defineUser(sequelize);
const Book = defineBook(sequelize);
const Borrow = defineBorrow(sequelize);

// Define associations
Borrow.belongsTo(User, { foreignKey: "user_id", as: "user" });
Borrow.belongsTo(Book, { foreignKey: "book_id", as: "book" });
User.hasMany(Borrow, { foreignKey: "user_id", as: "borrows" });
Book.hasMany(Borrow, { foreignKey: "book_id", as: "borrows" });

export { sequelize, User, Book, Borrow  };
