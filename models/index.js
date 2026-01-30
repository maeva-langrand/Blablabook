import { Author } from "./author.model.js";
import { Book } from "./book.model.js";
import { Genre } from "./genre.model.js";
import { User } from "./user.model.js";
import { UserBook } from "./user-book.model.js";
import { ContactMessage } from "./contact.model.js";
import { sequelize } from "./sequelize-client.js";

// Définir les associations entre les modèles 

User.belongsToMany(Book, { through: UserBook,
    foreignKey: "user_id",
    otherKey: "book_id",
    as: "user_book"});

Book.belongsToMany(User, { through: UserBook,
    foreignKey: "book_id",
    otherKey: "user_id",
    as: "book_user"});

UserBook.belongsTo(User, { foreignKey: "user_id", as: "user" });

Book.belongsToMany(Author, { through: "book_has_author",
    foreignKey: "book_id",
    otherKey: "author_id",
    as: "book_author"});

Author.belongsToMany(Book, { through: "book_has_author",
    foreignKey: "author_id",
    otherKey: "book_id",
    as: "author_book"});

Book.belongsToMany(Genre, { through: "book_has_genre",
    foreignKey: "book_id",
    otherKey: "genre_id",
    as: "book_genre"});

Genre.belongsToMany(Book, { through: "book_has_genre",
    foreignKey: "genre_id",
    otherKey: "book_id",
    as: "genre_book"}); 


UserBook.belongsTo(Book, {
  foreignKey: "book_id",
});

UserBook.belongsTo(User, {
  foreignKey: "user_id",
});

Book.hasMany(UserBook, {
  foreignKey: "book_id",
});

User.hasMany(UserBook, {
  foreignKey: "user_id",
});

export { Author, Book, Genre, User, UserBook, ContactMessage, sequelize };
