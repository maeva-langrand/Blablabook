import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Book extends Model {}

Book.init(
  {
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    publication_date: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cover: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
  },
  {
    sequelize,
    modelName: "Book",
    tableName: "book"
  }
);