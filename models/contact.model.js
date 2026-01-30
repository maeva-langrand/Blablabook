import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class ContactMessage extends Model {}

ContactMessage.init(
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "ContactMessage",
    tableName: "contact_message"
  }
);
