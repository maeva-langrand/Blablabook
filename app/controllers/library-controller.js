
import { libraryDatamapper } from "../datamappers/library-datamapper.js";
import { userBooksDatamapper } from "../datamappers/book-datamapper.js";
import { UserBook, Book } from "../../models/index.js";

export async function showLibraryPage(req, res) {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/auth");
    }

    const userId = req.session.user.id;

    const books = await libraryDatamapper.getUserLibrary(userId);

const toRead = books.filter(b => b.status === "to_read");
const read = books.filter(b => b.status === "read");

/*let lastConsultedBooks = [];

const entries = await userBooksDatamapper.getLastConsultedBooks(
  userId,
  10
);

lastConsultedBooks = entries.map(e =>
  e.Book.get({ plain: true })
);*/

res.render("library", 
  { pagetitle: "| Ma bibliothèque", 
    css: "library.css", 
    toRead, 
    read,
 /* lastConsultedBooks */});
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur bibliothèque");
  }
};


export async function addBookToLibrary(req, res) {
  try {
    const userId = req.session.user.id;
    const { bookId, status } = req.body;

    const [userBook, created] = await UserBook.findOrCreate({
      where: {
        user_id: userId,
        book_id: bookId
      },
      defaults: { status }
    });

    if (!created) {
      userBook.status = status;
      await userBook.save();
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Impossible d'ajouter le livre" });
  }
};

/*remove a book from a list*/
export async function removeBookFromLibrary(req, res) {
  try {
    const userId = req.session.user.id;
    const { bookId } = req.body;

    const userBook = await UserBook.findOne({
      where: { user_id: userId, book_id: bookId }
    });

    if (!userBook) {
      return res.status(404).json({ error: "Livre non trouvé dans votre bibliothèque" });
    }

    userBook.status = "remove";
    await userBook.save();

    res.status(200).json({ success: true, bookId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Impossible de retirer le livre" });
  }
};

