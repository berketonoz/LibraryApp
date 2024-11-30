import { Sequelize } from "sequelize";

const sequelize = new Sequelize("library_management", "root", "Joe17814..", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});


export default sequelize;
