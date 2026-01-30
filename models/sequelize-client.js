import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_URL,
  {
    logging: false, // ne pas afficher les requete sql en console
    define: {
      timestamps: true, // ajouter les champs timestamps (par défaut à true)
      underscored: true, // les noms de champs seront en snake_case
      createdAt: "created_at", // mapper les champs timestamps
      updatedAt: "updated_at"
    }
  }
);
// pour tester la connexion à la base de données
/*  try {
   await sequelize.authenticate();
   console.log("Connection has been established successfully.");
 } catch (error) {
  console.error("Unable to connect to the database:", error);
 } */
