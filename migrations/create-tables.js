import { sequelize } from "../models/index.js"


/* console.log("Suppression des tables existantes..."); // Suppression des tables existantes
await sequelize.drop({});

console.log("Définition des tables..."); // Création des tables selon les modèles définis
await sequelize.sync(); 

// Vérifie la migration en affichant la structure de la db
console.log("Structure de la base de données : ", await sequelize.getQueryInterface().showAllTables());

console.log("Migration OK ! Fermeture de la base..."); // Fermeture de la connexion à la base de données
await sequelize.close(); */


console.log("Synchronisation des tables...");
await sequelize.sync({ alter: true }); // Met à jour sans supprimer les données
console.log("Tables OK !");
console.log("Structure : ", await sequelize.getQueryInterface().showAllTables());
await sequelize.close();