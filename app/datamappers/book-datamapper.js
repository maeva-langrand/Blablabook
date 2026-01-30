import { Book, Author, Genre, UserBook, User } from "../../models/index.js";
import { Op } from "sequelize";


export const booksDatamapper = {



  /*BAsic view, some books/genre*/
  async getBooksByGenres(limitPerGenre = 4) {
    const genres = await Genre.findAll({
      include: [
        {
          model: Book,
          as: "genre_book",
          through: { attributes: [] },
          include: [
            { model: Author, as: "book_author", through: { attributes: [] } }
          ]
        }
      ],
      order: [["name", "ASC"]]
    });


   return genres.map(genre => ({
      ...genre.get({ plain: true }),
      genre_book: genre.genre_book.slice(0, limitPerGenre)
    }));
  },


  /*ALl books if searched*/
  async searchBooks({ authorId, genreId, year }) {
    const where = {};
    if (year) where.publication_date = year;

    const include = [];

    if (authorId) {
      include.push({
        model: Author,
        as: "book_author",
        through: { attributes: [] },
        where: { id: authorId },
        required: true
      });
    } else {
      include.push({ model: Author, as: "book_author", through: { attributes: [] } });
    }

    if (genreId) {
      include.push({
        model: Genre,
        as: "book_genre",
        through: { attributes: [] },
        where: { id: genreId },
        required: true
      });
    } else {
      include.push({ model: Genre, as: "book_genre", through: { attributes: [] } });
    }

    const books = await Book.findAll({
      where,
      include,
      order: [["title", "ASC"]] 
    });

    return books.map(book => book.get({ plain: true }));
  },

  async getAllAuthors() {
    return Author.findAll({ order: [["last_name", "ASC"]] });
  },

  async getAllGenres() {
    return Genre.findAll({ order: [["name", "ASC"]] });
  },

  async getBooksByGenre(genreId) {
  return this.searchBooks({ genreId });
},

  /*REquest by query for searchbar*/
  
  async searchBooksByQuery(q) {
  return Book.findAll({
    include: [
      {
        model: Author,
        as: "book_author",
        through: { attributes: [] },
        required: false
      },
      {
        model: Genre,
        as: "book_genre",
        through: { attributes: [] },
        required: false
      }
    ],
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${q}%` } },
        { '$book_author.first_name$': { [Op.iLike]: `%${q}%` } },
        { '$book_author.last_name$': { [Op.iLike]: `%${q}%` } },
        { '$book_genre.name$': { [Op.iLike]: `%${q}%` } } 
      ]
    },
    order: [["title", "ASC"]]
  }).then(books => books.map(b => b.get({ plain: true })));
}
};
  

export const homeBooksDatamapper = {
  async getBooksHomepage (){
    return Book.findAll({ order : [["publication_date", "DESC"]], limit : 3 })
  } 
};

/* User last consulted books */

async function markAsConsulted(userId, bookId) {
  return UserBook.upsert({
    user_id: userId,
    book_id: bookId,
  });
}

async function getLastConsultedBooks(userId, limit = 3) {
  return UserBook.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Book,
        include: [
          { model: Author, as: "book_author", through: { attributes: [] } },
          { model: Genre, as: "book_genre", through: { attributes: [] } },
        ],
      },
    ],
    order: [["updated_at", "DESC"]],
    limit,
  });
}

export const userBooksDatamapper = {
  markAsConsulted,
  getLastConsultedBooks,
};