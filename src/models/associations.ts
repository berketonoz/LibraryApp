// src/models/index.ts

import User from './User';
import Book from './Book';
import Borrow from './Borrow';

// Define associations
Borrow.belongsTo(User, { foreignKey: "user_id", as: "user" });
Borrow.belongsTo(Book, { foreignKey: "book_id", as: "book" });
User.hasMany(Borrow, { foreignKey: "user_id", as: "borrows" });
Book.hasMany(Borrow, { foreignKey: "book_id", as: "borrows" });

// Export models
export { User, Book, Borrow };
