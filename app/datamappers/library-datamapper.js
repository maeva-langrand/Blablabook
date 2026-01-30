import { User, Genre, Book, Author } from "../../models/index.js";

export const libraryDatamapper = {

  async getBooksGroupedByGenre() {
    return Genre.findAll({
      include: [
        {
          model: Book,
          as: "genre_book",
          through: { attributes: [] }
        }
      ],
      order: [
        ["name", "ASC"],
        [{ model: Book, as: "genre_book" }, "title", "ASC"]
      ]
    });
  },

   async getUserLibrary(userId) {

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Book,
          as: "user_book", 
          through: { attributes: ["status"] }, 
          include: [
            { model: Author, as: "book_author", through: { attributes: [] } }
          ]
        }
      ]
    });

    if (!user) return []; 

    return (user.user_book || []).map(b => ({
      ...b.get({ plain: true }),
      status: b.UserBook?.status || "to_read"
    }));
  }

};

