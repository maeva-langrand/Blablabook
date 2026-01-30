import fs from "fs";

// URL de base pour l'API Open Library
const BASE_URL = "https://openlibrary.org/search.json";

// Liste des genres de livres à rechercher, avec 200 résultats par genre pour augmenter les chances
const genres = [
  { query: "Fantastique", limit: 500 },
  { query: "Magie", limit: 500 },
  { query: "Policier", limit: 500 },
  { query: "Thriller", limit: 500 },
  { query: "Jeune adulte", limit: 500 },
  { query: "Science-fiction", limit: 500 },
  { query: "Romance", limit: 500 },
  { query: "Aventure", limit: 500 },
  { query: "Mystère", limit: 500 },
  { query: "Drame", limit: 500 },
  { query: "Horreur", limit: 500 },
  { query: "Comédie", limit: 500 },
  { query: "Historique", limit: 500 },
  { query: "Biographie", limit: 500 },
  { query: "Conte", limit: 500 },
  { query: "Poésie", limit: 500 },
];

async function fetchBooks() {
  let allBooks = [];

  for (const genre of genres) {
    const url = `${BASE_URL}?q=${encodeURIComponent(genre.query)}&language=fre&fields=key,title,author_name,first_publish_year,editions,editions.key,editions.title,editions.cover_i,editions.description,editions.language&limit=${genre.limit}`;
    console.log(`Récupération des livres : ${genre.query}`);

    try {
      const res = await fetch(url);
      
      // Vérifier si la réponse est OK
      if (!res.ok) {
        console.warn(`Erreur HTTP ${res.status} pour ${genre.query}, passage au genre suivant`);
        continue;
      }
      
      const data = await res.json();

      for (const book of data.docs) {
        if (book.editions && book.editions.docs) {
          for (const edition of book.editions.docs) {
            // Vérifie que l'édition est en français et contient les champs obligatoires incluant la description
            if (
              edition.language &&
              edition.language.includes("fre") &&
              edition.title &&
              book.first_publish_year &&
              edition.cover_i &&
              edition.description // Description obligatoire dans l'édition française
            ) {
              const bookWithDetails = {
                key: edition.key,
                title: edition.title,
                author: book.author_name ? book.author_name[0] : "Inconnu",
                genre: genre.query,
                year: book.first_publish_year,
                cover_url: `https://covers.openlibrary.org/b/id/${edition.cover_i}-L.jpg`,
                description: edition.description,
              };
              allBooks.push(bookWithDetails);
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Erreur lors de la récupération de ${genre.query}: ${error.message}`);
      console.log('Attente de 5 secondes avant de continuer...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Petit délai entre chaque genre pour ne pas surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Sauvegarde les livres complets dans un fichier JSON
  fs.writeFileSync("app/database/openlibrary_raw.json", JSON.stringify(allBooks, null, 2));
  console.log(`${allBooks.length} livres français complets récupérés.`);
}

fetchBooks(); // Appel de la fonction pour lancer la récupération des livres