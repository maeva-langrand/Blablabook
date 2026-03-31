import fs from 'fs';
import { Author, Genre, Book, User, UserBook, sequelize } from '../models/index.js';

// Vérification : si des livres existent déjà, on ne reseed pas
const existingBooks = await Book.count();
if (existingBooks > 0) {
  console.log("✅ Base déjà peuplée, seed ignoré.");
  await sequelize.close();
  process.exit(0);
}

async function seedDatabase() {
  const transaction = await sequelize.transaction();
  try {
    // Lecture des données structurées
    const { authors, genres, books } = JSON.parse(
      fs.readFileSync('app/database/openlibrary_structured.json', 'utf-8')
    );

    // Insertion des auteurs
    const authorInstances = await Author.bulkCreate(authors, {
      ignoreDuplicates: true,  // Ignorer les doublons basés sur les contraintes uniques
      returning: true, // Retourner les instances insérées
      transaction, // Utiliser la transaction
    });
    console.log(`✅ ${authors.length} auteurs insérés.`);

    // Insertion des genres
    const genreInstances = await Genre.bulkCreate(genres, {
      ignoreDuplicates: true,
      returning: true,
      transaction,
    });
    console.log(`✅ ${genres.length} genres insérés.`); // Fin de l'insertion des genres

    // Insertion des livres et de leurs associations
    for (const book of books) {
      const createdBook = await Book.create(
        {
          title: book.title, // Titre du livre
          publication_date: book.publication_date, // Date de publication
          summary: book.summary, // Résumé du livre
          cover: book.cover, // URL de la couverture
          featured: false, // Par défaut, les livres ne sont pas mis en avant
        },
        { transaction } // Utiliser la transaction
      );

      // Association des auteurs 
      for (const fullName of book.authorNames) { // Parcours des noms complets des auteurs du livre
        // Gestion des noms avec initiales (ex: "J. K. Rowling" → first_name: "J. K.", last_name: "Rowling")
        const nameParts = fullName.trim().split(/\s+/); // Split sur les espaces (y compris multiples)
        const last_name = nameParts[nameParts.length - 1]; // Le dernier mot est le nom de famille
        const first_name = nameParts.slice(0, -1).join(" ") || last_name; // Le reste constitue le prénom
        
        const author = authorInstances.find( // Recherche de l'instance d'auteur correspondante
          (a) => a.first_name === first_name && a.last_name === last_name // Recherche de l'auteur par nom et prénom
        );
        if (author) { // Si l'auteur existe, on crée l'association
          await createdBook.addBook_author(author, { transaction });
        }
      }

      // Association des genres 
      for (const genreName of book.genreNames) { // Parcours des noms de genres du livre
        const genre = genreInstances.find((g) => g.name === genreName); // Recherche du genre par nom
        if (genre) { // Si le genre existe, on crée l'association
          await createdBook.addBook_genre(genre, { transaction }); 
        }
      }
    }

    // Ajout d'utilisateurs 
    const users = [
      { username: "toto", email: "toto@example.com" , password: "$argon2i$v=19$m=16,t=2,p=1$b3d6MEpYRVluZ1h3b3ZEUQ$dpUf3r42as95DcSPrigdXA", role: "user" },
      { username: "roro", email: "blablabook.fig@gmail.com" , password: "$argon2i$v=19$m=16,t=2,p=1$b3d6MEpYRVluZ1h3b3ZEUQ$dpUf3r42as95DcSPrigdXA", role: "user" },
      { username: "May", email: "maeva.langrand@oclock.school" , password: "$argon2i$v=19$m=16,t=2,p=1$VHRwc1dYSzlnU0YzRXlnUA$bG7HYMbx3A1Per+JWiSt3Q", role: "user" },
    ];

    for (const userData of users) {
      await User.create(userData, { transaction });
    }
    console.log(`✅ ${users.length} utilisateurs insérés.`); // Fin de l'insertion des utilisateurs

    // Ajout avis a un livre pour un utilisateur (toto)
// Ajout avis à un livre pour un utilisateur (toto)
const reviews = [
  {
    review: "Un excellent livre, je le recommande à tous !",
    rating: 5,
    user_id: 1, // ID de l'utilisateur
    book_id: 82, // ID du livre
  }
];

for (const reviewData of reviews) {
  await UserBook.create(reviewData, { transaction });
}
console.log(`✅ ${reviews.length} avis insérés.`);

    await transaction.commit(); // Valider la transaction
    console.log(`✅ ${books.length} livres insérés avec leurs associations.`); // Fin du processus d'insertion
  } catch (error) {
    await transaction.rollback(); // Annuler la transaction en cas d'erreur
    console.error("Erreur lors de l'insertion des données :", error); // Afficher l'erreur
  } finally {
    await sequelize.close(); // Fermer la connexion à la base de données
  }
}

seedDatabase();
