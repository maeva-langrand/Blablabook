import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Author extends Model {}

Author.init(
  {
    first_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    last_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: "Author",
    tableName: "author"
  }
);