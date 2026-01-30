import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().trim().pattern(/^[a-zA-Z0-9_.-]+$/).min(3).max(30).required().messages({
    "string.empty": "Le nom d'utilisateur est obligatoire",
    "string.pattern.base": "Le nom d'utilisateur ne doit contenir que des lettres, chiffres, underscores, tirets et points",
    "string.min": "Le nom d'utilisateur doit contenir au moins 3 caractères",
    "string.max": "Le nom d'utilisateur ne doit pas dépasser 30 caractères"
  }),
  email: Joi.string().trim().email().max(255).required().messages({
    "string.email": "Email invalide",
    "string.empty": "L'email est obligatoire",
    "string.max": "L'email ne doit pas dépasser 255 caractères"
  }),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.empty": "Le mot de passe est obligatoire",
      "string.min": "Le mot de passe doit contenir au moins 8 caractères",
      "string.max": "Le mot de passe ne doit pas dépasser 100 caractères",
      "string.pattern.base": "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)"
    }),
  verify_password: Joi.string().valid(Joi.ref('password')).required().messages({
    "any.only": "Les mots de passe ne correspondent pas",
    "string.empty": "La confirmation du mot de passe est obligatoire"
  })
});

export const loginSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    "string.empty": "Le nom d'utilisateur est obligatoire"
  }),
  password: Joi.string().required().messages({
    "string.empty": "Le mot de passe est obligatoire"
  })
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().max(255).required().messages({
    "string.email": "Email invalide",
    "string.empty": "L'email est obligatoire",
    "string.max": "L'email ne doit pas dépasser 255 caractères"
  })
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Le lien de réinitialisation est manquant"
  }),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.empty": "Le mot de passe est obligatoire",
      "string.min": "Le mot de passe doit contenir au moins 8 caractères",
      "string.max": "Le mot de passe ne doit pas dépasser 100 caractères",
      "string.pattern.base": "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)"
    }),
  verify_password: Joi.string().valid(Joi.ref('password')).required().messages({
    "any.only": "Les mots de passe ne correspondent pas",
    "string.empty": "La confirmation du mot de passe est obligatoire"
  })
});
