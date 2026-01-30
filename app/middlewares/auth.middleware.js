import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/auth-validator.js";
import { StatusCodes } from "http-status-codes";

export function validateRegister(req, res, next) {
  const validation = registerSchema.validate(req.body, { abortEarly: false });
  
  if (validation.error) {
    const errorMessages = validation.error.details.map((d) => d.message).join(", ");
    return res.status(StatusCodes.BAD_REQUEST).render("login.ejs", {
      pagetitle: "| Inscription",
      css: "login.css",
      error: errorMessages,
      username: req.body.username || "",
      email: req.body.email || "",
      type : "register"
    });
  }

  req.validatedData = validation.value;
  next();
}

export function validateLogin(req, res, next) {
  const validation = loginSchema.validate(req.body, { abortEarly: false });
  
  if (validation.error) {
    const errorMessages = validation.error.details.map((d) => d.message).join(", ");
    return res.status(StatusCodes.BAD_REQUEST).render("login.ejs", {
      pagetitle: "| Connexion",
      css: "login.css",
      error: errorMessages,
      username: req.body.username || "",
      type : "login"
    });
  }

  req.validatedData = validation.value;
  next();
}

export function validateForgotPassword(req, res, next) {
  const validation = forgotPasswordSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errorMessages = validation.error.details.map((d) => d.message).join(", ");
    return res.status(StatusCodes.BAD_REQUEST).render("forgot-password.ejs", {
      pagetitle: "| Mot de passe oublié",
      css: "login.css",
      error: errorMessages,
      email: req.body.email || "",
    });
  }

  req.validatedData = validation.value;
  next();
}

export function validateResetPassword(req, res, next) {
  const validation = resetPasswordSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errorMessages = validation.error.details.map((d) => d.message).join(", ");
    return res.status(StatusCodes.BAD_REQUEST).render("reset-password.ejs", {
      pagetitle: "| Réinitialiser le mot de passe",
      css: "login.css",
      error: errorMessages,
      token: req.body.token || "",
    });
  }

  req.validatedData = validation.value;
  next();
}

// Middleware pour protéger les routes nécessitant une authentification
export function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(StatusCodes.UNAUTHORIZED).redirect("/login?error=auth_required");
  }
  next();
}

// Middleware pour rediriger les utilisateurs déjà connectés 
export function redirectIfAuth(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect("/");
  }
  next();
}
