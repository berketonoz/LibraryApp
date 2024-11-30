import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../config/database';
import Borrow from './Borrow';

class User extends Model {
  public id!: number;
  public name!: string;
  public borrows?: Borrow[];

  public static associations: {
    borrows: Association<User, Borrow>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    timestamps: false, // To disable sequelize's timestamp feature
    sequelize,
  }
);

export default User;
