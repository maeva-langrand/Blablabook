import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class UserBook extends Model {}

UserBook.init(
  {
    status: {
      type: DataTypes.ENUM,
      values: ["to_read", "read", "remove"],
      allowNull: true,
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true 
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5 }
      }
  },
  {
    sequelize,
    modelName: "UserBook",
    tableName: "user_has_book",
    underscored: true,
    validate: {
      ratingWithReview() {
        if (this.review && this.review.trim() && (this.rating === null || this.rating === undefined)) {
          throw new Error("Une note doit être fournie si un avis est laissé.");
        }
        if ((this.rating !== null && this.rating !== undefined) && (!this.review || !this.review.trim())) {
          throw new Error("Un avis doit être fourni si une note est laissée.");
        }
      }
    }
  }
);