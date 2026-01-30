import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM,
      values: ["user", "admin"],
      allowNull: false,
      defaultValue: "user"
    },
    password_reset_token: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    password_reset_expires: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "user"
  }
);  