import argon2 from "argon2";
import { User } from "../../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import { generateResetToken, generateTokenExpiration } from "../services/tokenService.js";
import { sendPasswordResetEmail } from "../services/emailService.js";

export function showLoginPage(req, res) {
    try {
        const successMessage = req.query.success === "password-reset"
            ? "Votre mot de passe a été réinitialisé. Vous pouvez vous connecter."
            : undefined;

        res.render("login.ejs", { pagetitle: "| Connexion", css: "login.css", type: "login", success: successMessage });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", { error: "Erreur lors du chargement de la page" });
    }
};

export function showRegisterPage(req, res) {
    try {
        res.render("login.ejs", { pagetitle: "| Inscription", css: "login.css", type: "register" });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", { error: "Erreur lors du chargement de la page" });
    }
};

export async function registerUser(req, res) {
    try {
        const { username, email, password } = req.validatedData;

        // Vérifier si l'utilisateur ou l'email existe déjà
        const existingUser = await User.findOne({ 
            where: { 
                [User.sequelize.Sequelize.Op.or]: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            const field = existingUser.username === username ? "nom d'utilisateur" : "email";
            return res.status(StatusCodes.CONFLICT).render("login.ejs", { 
                pagetitle: "| Inscription",
                css: "login.css",
                error: `Ce ${field} est déjà utilisé`,
                username: req.body.username || "",
                email: req.body.email || "",
                type: "register"
            });
        }

        const hashedPassword = await argon2.hash(password);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

/*         console.log("Utilisateur ajouté !");
        console.log("Nom:", username);
        console.log("Email:", email); */

        // Connecter automatiquement l'utilisateur
        req.session.user = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            isNew: true
        };

        return res.status(StatusCodes.CREATED).redirect("/");
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("login.ejs", { 
            pagetitle: "| Inscription",
            css: "login.css",
            error: "Erreur lors de l'enregistrement : " + error.message,
            username: req.body.username || "",
            email: req.body.email || "",
            type: "register"
        });
    }
};

export async function login(req, res) {
    try {
        const { username, password } = req.validatedData;

        const searchUser = await User.findOne({ where: { username } });

        if (!searchUser) {
            return res.status(StatusCodes.UNAUTHORIZED).render("login.ejs", { 
                pagetitle: "| Connexion",
                css: "login.css",
                error: "Le nom d'utilisateur ou le mot de passe est incorrect",
                username: req.body.username || "",
                type: "login"
            });
        }

        const passwordVerify = await argon2.verify(searchUser.password, password);

        if (!passwordVerify) {
            return res.status(StatusCodes.UNAUTHORIZED).render("login.ejs", { 
                pagetitle: "| Connexion",
                css: "login.css",
                error: "Le nom d'utilisateur ou le mot de passe est incorrect",
                username: req.body.username || "",
                type: "login"
            });
        }

        req.session.user = {
            id: searchUser.id,
            username: searchUser.username,
            email: searchUser.email
        };

        console.log("Connexion réussie !");
        return res.status(StatusCodes.OK).redirect("/");
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("login.ejs", { 
            pagetitle: "| Connexion",
            css: "login.css",
            error: "Erreur lors de la connexion",
            username: req.body.username || "",
            type: "login"
        });
    }
};

export function logout(req, res) {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error("Erreur lors de la déconnexion :", err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).redirect("/login?error=logout");
            }

            res.clearCookie("blablabook-session");
            return res.redirect("/");
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).redirect("/login?error=logout");
    }
};

export function showForgotPasswordPage(req, res) {
    try {
        res.render("forgot-password.ejs", { pagetitle: "| Mot de passe oublié", css: "login.css" });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", { error: "Erreur lors du chargement de la page" });
    }
};

export async function forgotPassword(req, res) {
    try {
        const { email } = req.validatedData;

        const user = await User.findOne({ where: { email } });

        // Message générique pour éviter l'énumération des comptes
        const genericMessage = "Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.";

        if (!user) {
            return res.status(StatusCodes.OK).render("forgot-password.ejs", {
                pagetitle: "| Mot de passe oublié",
                css: "login.css",
                success: genericMessage,
            });
        }

        const token = generateResetToken();
        const expires = generateTokenExpiration();
        
        // Sauvegarder le token et sa date d'expiration dans la BDD
        await user.update({ 
            password_reset_token: token,
            password_reset_expires: expires
        });
        
        const resetLink = `${req.protocol}://${req.get("host")}/reset-password?token=${token}`;

        try {
            await sendPasswordResetEmail(email, resetLink);
        } catch (emailError) {
            console.error("Erreur lors de l'envoi de l'email de réinitialisation:", emailError);
            // Répondre quand même avec le message générique pour ne rien divulguer
        }

        return res.status(StatusCodes.OK).render("forgot-password.ejs", {
            pagetitle: "| Mot de passe oublié",
            css: "login.css",
            success: genericMessage,
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("forgot-password.ejs", {
            pagetitle: "| Mot de passe oublié",
            css: "login.css",
            error: "Une erreur est survenue. Veuillez réessayer plus tard.",
        });
    }
};

export function showResetPasswordPage(req, res) {
    const { token } = req.query;

    if (!token) {
        return res.status(StatusCodes.BAD_REQUEST).render("forgot-password.ejs", {
            pagetitle: "| Mot de passe oublié",
            css: "login.css",
            error: "Lien de réinitialisation invalide ou manquant.",
        });
    }

    return res.render("reset-password.ejs", {
        pagetitle: "| Réinitialiser le mot de passe",
        css: "login.css",
        token,
    });
}

export async function resetPassword(req, res) {
    try {
        const { token, password } = req.validatedData;

        if (!token) {
            return res.status(StatusCodes.BAD_REQUEST).render("reset-password.ejs", {
                pagetitle: "| Réinitialiser le mot de passe",
                css: "login.css",
                error: "Token manquant",
                token,
            });
        }

        // Trouver l'utilisateur avec ce token
        const user = await User.findOne({ 
            where: { password_reset_token: token } 
        });

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).render("reset-password.ejs", {
                pagetitle: "| Réinitialiser le mot de passe",
                css: "login.css",
                error: "Lien de réinitialisation invalide ou déjà utilisé.",
                token,
            });
        }

        // Vérifier que le token n'a pas expiré
        if (!user.password_reset_expires || user.password_reset_expires < new Date()) {
            return res.status(StatusCodes.BAD_REQUEST).render("reset-password.ejs", {
                pagetitle: "| Réinitialiser le mot de passe",
                css: "login.css",
                error: "Ce lien a expiré. Veuillez demander une nouvelle réinitialisation.",
                token,
            });
        }

        const hashedPassword = await argon2.hash(password);
        
        // Réinitialiser le mdp et invalider le token
        await user.update({ 
            password: hashedPassword,
            password_reset_token: null,
            password_reset_expires: null
        });

        return res.redirect("/login?success=password-reset");
    } catch (error) {
        console.error(error);
        const message = error.message || "Lien de réinitialisation invalide ou expiré.";
        return res.status(StatusCodes.BAD_REQUEST).render("reset-password.ejs", {
            pagetitle: "| Réinitialiser le mot de passe",
            css: "login.css",
            error: message,
            token: req.body?.token,
        });
    }
}