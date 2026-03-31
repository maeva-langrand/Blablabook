
import { Book, Author, Genre, UserBook} from "../../models/index.js";
import { booksDatamapper, homeBooksDatamapper, userBooksDatamapper } from "../datamappers/book-datamapper.js";
import { libraryDatamapper } from "../datamappers/library-datamapper.js";

export async function showBooksPage(req, res, next) {
  
   try {
    const { q, authorId, genreId, year } = req.query; // ajoute q pour la recherche texte

    let books = [];
    let genres = [];
    let isSearch = false;
  if (q) {
      books = await booksDatamapper.searchBooksByQuery(q);
      isSearch = true;
    } else if (authorId || genreId || year) {
      books = await booksDatamapper.searchBooks({ authorId, genreId, year });
      isSearch = true;
    } else {
      genres = await booksDatamapper.getBooksByGenres(4);
    }

    const authors = await booksDatamapper.getAllAuthors();
    const allGenres = await booksDatamapper.getAllGenres();


    let userLibrary = [];
    if (req.session.user) {
      userLibrary = await libraryDatamapper.getUserLibrary(req.session.user.id);
       books = books.map(book => {
    const bookPlain = book.get ? book.get({ plain: true }) : book;
    const libBook = userLibrary.find(b => b.id === bookPlain.id);
    return { ...bookPlain, user_status: libBook?.status || null };
  });

  genres = genres.map(genre => ({
    ...genre,
    genre_book: genre.genre_book.map(book => {
      const bookPlain = book.get ? book.get({ plain: true }) : book;
      const libBook = userLibrary.find(b => b.id === bookPlain.id);
      return { ...bookPlain, user_status: libBook?.status || null };
    })
  }));

    }

    let lastConsultedBooks = [];

if (req.session.user) {
  const entries = await userBooksDatamapper.getLastConsultedBooks(
    req.session.user.id,
    3
  );

  lastConsultedBooks = entries.map(e =>
    e.Book.get({ plain: true })
  );
}

    res.render("books", {
      pagetitle: "| Tous les livres",
      css: "book.css",
      books,
      genres,
      authors,
      allGenres,
      isSearch,
      searchQuery: q || "",
      lastConsultedBooks
    });

  } catch (error) {
    console.error("Erreur showBooksPage:", error);
    next(error);
  }
};

export async function showBookDetailsPage(req, res, next) {
  try {
    const bookId = req.params.id;
    const userId = req.session.user?.id;

    const book = await Book.findByPk(bookId, {
      include: [
        { model: Author, as: "book_author", through: { attributes: [] } },
        { model: Genre, as: "book_genre", through: { attributes: [] } }
      ]
    });

    if (!book) {
      const error = new Error("Livre introuvable");
      error.type = "BOOK_NOT_FOUND";
      error.statusCode = 404;
      return next(error);
    }
if (req.session.user) {
  const existing = await UserBook.findOne({
    where: { user_id: req.session.user.id, book_id: bookId }
  });
  
  if (existing) {
    await existing.update({ updated_at: new Date() });
  } else {
    await UserBook.create({
      user_id: req.session.user.id,
      book_id: bookId,
      status: null
    });
  }
}
    const reviews = await UserBook.findAll({
      where: { book_id: bookId },
      attributes: ["user_id", "rating", "review", "created_at"],
      order: [["created_at", "DESC"]],
      include: [
        { association: "user", attributes: ["id", "username"] }
      ]
    });

    let userReview = null;
    let user_status = null;

    if (userId) {
      userReview = reviews.find(r => r.user_id === userId) || null;

      const userBook = await UserBook.findOne({
        where: { book_id: bookId, user_id: userId }
      });

      if (userBook) {
        user_status = userBook.status;
      }
    }

    res.render("book-details", {
      pagetitle: `| ${book.title}`,
      css: "book.css",
      book: { ...book.get({ plain: true }), user_status },
      reviews: reviews.map(r => r.get({ plain: true })),
      userReview,
      user: req.session.user || null
    });

  } catch (error) {
    console.error("Erreur showBookDetailsPage:", error);
    next(error);
  }
}

export async function showHomePage(req, res) {
 const books = await homeBooksDatamapper.getBooksHomepage();

 res.render("home",{
      pagetitle: "| Accueil",
      css: "styles.css",
      books,
      user: req.session.user || null
 });

 // Supprimer le flag isNew après affichage du message de bienvenue
 if (req.session.user && req.session.user.isNew) {
   delete req.session.user.isNew;
 }
};


/*Just a function to make the button "more of this genre" works*/
export const booksController = {
  async showBooks(req, res) {
    try {
      const { genreId, authorId, year } = req.query;

      const books = await booksDatamapper.searchBooks({ genreId, authorId, year });
      const authors = await booksDatamapper.getAllAuthors();
      const allGenres = await booksDatamapper.getAllGenres();
      

      res.render("books", {
        pagetitle: "| Livres",
        books,
        isSearch: !!(genreId || authorId || year),
        authors,
        allGenres
      });
    } catch (err) {
      next({
        type: 'SERVER_ERROR',
      });
          }
  }
};

// Review functions
async function findUserReview(userId, bookId) {
  return UserBook.findOne({
    where: { user_id: userId, book_id: bookId }
  });
}

export async function submitReview(req, res) {
  const bookId = req.params.id;
  const userId = req.session.user.id;
  const { rating, review } = req.validatedData;

  try {
    const existingReview = await findUserReview(userId, bookId);

    if (existingReview) {
      return res.redirect(`/livre/${bookId}?error=Vous avez déjà soumis un avis pour ce livre.`);
    }

    await UserBook.create({
      user_id: userId,
      book_id: bookId,
      rating,
      review
    });

    res.redirect(`/livre/${bookId}?success=Votre avis a été soumis avec succès.`);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.redirect(`/livre/${bookId}?error=Vous avez déjà soumis un avis pour ce livre.`);
    }

    console.error("Erreur submitReview :", error);
    res.redirect(`/livre/${bookId}?error=Une erreur est survenue lors de la soumission de votre avis.`);
  }
}

export async function updateReview(req, res) {
  const bookId = req.params.id;
  const userId = req.session.user.id;
  const updateData = req.validatedData;

  try {
    const existingReview = await findUserReview(userId, bookId);

    if (!existingReview) {
      return res.redirect(`/livre/${bookId}?error=Aucun avis trouvé à mettre à jour.`);
    }

    await existingReview.update(updateData);

    res.redirect(`/livre/${bookId}?success=Votre avis a été mis à jour avec succès.`);
  } catch (error) {
    console.error("Erreur updateReview :", error);
    res.redirect(
      `/livre/${bookId}?error=Une erreur est survenue lors de la mise à jour de votre avis.`
    );
  }
}

export async function deleteReview(req, res) {
  const bookId = req.params.id;
  const userId = req.session.user.id;

  try {
    const review = await findUserReview(userId, bookId);

    if (!review) {
      return res.redirect(`/livre/${bookId}?error=Aucun avis trouvé à supprimer.`);
    }

    await review.destroy();

    res.redirect(`/livre/${bookId}?success=Votre avis a été supprimé avec succès.`);
  } catch (error) {
    console.error("Erreur deleteReview :", error);
    res.redirect(`/livre/${bookId}?error=Une erreur est survenue lors de la suppression de votre avis.`);
  }
}
