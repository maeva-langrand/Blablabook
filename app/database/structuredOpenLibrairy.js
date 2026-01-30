import fs from "fs";

// Lecture des données brutes depuis le fichier JSON
const rawBooks = JSON.parse(fs.readFileSync("app/database/openlibrary_raw.json", "utf-8"));

// Tableau pour stocker les auteurs uniques
const authors = [];
// Map pour éviter les doublons d'auteurs
const authorMap = new Map();

// Extraction des auteurs uniques
rawBooks.forEach(book => {
  // Si le livre n'a pas d'auteur, on utilise "Auteur Inconnu"
  const authorName = book.author || "Auteur Inconnu";
  
  // Séparation du nom complet en nom et prénom
  const nameParts = authorName.split(" ");
  const last_name = nameParts[nameParts.length - 1]; // Le dernier mot est le nom de famille
  const first_name = nameParts.slice(0, -1).join(" ") || last_name; // Le reste constitue le prénom
  const key = `${first_name}_${last_name}`; // Clé unique pour éviter les doublons

  // Si l'auteur n'est pas déjà dans la Map, on l'ajoute
  if (!authorMap.has(key)) { // Auteur non encore enregistré
    authorMap.set(key, { first_name, last_name }); // Ajout à la Map
    authors.push({ first_name, last_name }); // Ajout au tableau des auteurs
  }
});

// Extraction des genres uniques
const genres = [...new Set(rawBooks.map(book => book.genre))].map(name => ({ name }));

// Structuration des livres
const books = rawBooks.map(book => ({
  title: book.title || "Titre inconnu", // Titre du livre
  publication_date: book.year, // Date de publication
  summary: book.description || null, // Résumé du livre
  cover: book.cover_url || null, // URL de la couverture
  authorNames: [book.author || "Auteur Inconnu"], // Noms des auteurs
  genreNames: [book.genre || "Genre Inconnu"], // Genres du livre
}));

// Sauvegarde des données structurées dans un fichier JSON
fs.writeFileSync( 
  'app/database/openlibrary_structured.json',
  JSON.stringify({ authors, genres, books }, null, 2) // Formatage avec indentation de 2 espaces
);

console.log(`Fichier openlibrary_structured.json généré avec ${authors.length} auteurs, ${genres.length} genres, et ${books.length} livres.`);