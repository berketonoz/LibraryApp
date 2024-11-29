import { DataTypes } from "sequelize";

const defineUser = (sequelize) => {
  return sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "users",
      timestamps: false, // Disable createdAt and updatedAt
    }
  );
};

export default defineUser;
