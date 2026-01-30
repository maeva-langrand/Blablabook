import argon2 from "argon2";
import { User, UserBook, Book, Author } from "../../models/index.js";
import { userBooksDatamapper } from "../datamappers/book-datamapper.js";

export async function showProfilPage(req, res) {
    console.log("1. profil appelé OK")
    if (!req.session.user) {
        console.log("pas de session user")
        return res.redirect("/login");
    }

    const userId = req.session.user.id;
    console.log("session OK, userId =", userId);


    try {
        console.log("récupération de l'utilisateur depuis DB...");
        const user = await User.findByPk(req.session.user.id, {
            include: [
                {
                    model: Book,
                    as: "user_book",
                    through: { attributes: ['status', 'created_at'] },
                    include: [
                        {
                            model: Author,
                            as: "book_author",
                            through: { attributes: [] }
                        }
                    ],
                         order: [[UserBook, 'created_at', 'DESC']]
                }
            ]
        });

        if (!user) {
            return res.redirect("/login");
        }

        const userBooks = user.user_book || [];

        let filteredBooks = userBooks.filter(book =>
            book.UserBook?.status === 'to_read' || book.UserBook?.status === 'read'
        );

        filteredBooks.sort(
    (a, b) => new Date(b.UserBook.created_at) - new Date(a.UserBook.created_at)
);
filteredBooks = filteredBooks.slice(0, 4);

        const bookCount = filteredBooks.length;

        console.log("récupération des derniers livres consultés...");
        const recentBooks = await userBooksDatamapper.getLastConsultedBooks(req.session.user.id, 3);
        console.log("recentBooks récupérés :", recentBooks.length);

        const statusTranslations = {
            'to_read' : 'À lire',
            'read': 'Lu'
        };

        function translateStatus(status){
            return statusTranslations[status] || 'Non défini';
        }

        res.render("profil", {
            user,
            bookCount,
            filteredBooks,
            translateStatus, 
            recentBooks,
            success: req.query.success || null,
            error: req.query.error || null,
            pagetitle: "| Mon profil",
            css: "profil.css"
        });

    } catch (error) {
        console.error("🔥 ERREUR PROFIL :", error);
        console.error(error.stack);
        res.status(500).send("Erreur serveur");
    }
}

export async function editProfilPage(req, res) {
    try {
        const { pseudo, email, password } = req.body;

        const user = await User.findByPk(req.session.user.id);
        if (!user) {
            return res.redirect("/profil?error=user_not_found");
        }

        const updateData = {};

        if (pseudo && pseudo.trim() !== "" && pseudo.trim() !== user.username) {
            const usernameExists = await User.findOne({
                where: { username: pseudo.trim() }
            });

            if (usernameExists) {
                return res.redirect("/profil?error=pseudo_exists");
            }

            updateData.username = pseudo.trim();
        }

        if (email && email.trim() !== "" && email.trim() !== user.email) {
            const emailExists = await User.findOne({
                where: { email: email.trim() }
            });

            if (emailExists) {
                return res.redirect("/profil?error=email_exists");
            }

            updateData.email = email.trim();
        }

        if (password && password.trim() !== "") {
            updateData.password = await argon2.hash(password.trim());
        }

        await user.update(updateData);

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        return res.redirect("/profil?success=true");

    } catch (error) {
        res.status(500).send("Erreur: " + error.message);
    }
}
