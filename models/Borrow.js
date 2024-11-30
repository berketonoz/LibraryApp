import { DataTypes } from "sequelize";

const defineBorrow = (sequelize) => {
  return sequelize.define(
    "Borrow",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      book_id: { type: DataTypes.INTEGER, allowNull: false },
      borrow_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      return_date: { type: DataTypes.DATE, defaultValue: null },
      user_score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 10,
        },
      },
    },
    {
      tableName: "borrows",
      timestamps: false, // Disable createdAt and updatedAt
    }
  );
};

export default defineBorrow;
