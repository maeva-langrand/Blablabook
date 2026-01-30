import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Genre extends Model {}

Genre.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: "Genre",
    tableName: "genre"
  }
);