import Joi from "joi";

export const contactSubmissionSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    "string.empty": "Le nom est obligatoire",
    "string.max": "Le nom ne doit pas dépasser 255 caractères"
  }),
  email: Joi.string().trim().email().max(255).required().messages({
    "string.email": "Email invalide",
    "string.empty": "L'email est obligatoire",
    "string.max": "L'email ne doit pas dépasser 255 caractères"
  }),
  message: Joi.string().trim().min(20).required().messages({
    "string.min": "Le message doit contenir au moins 20 caractères",
    "string.empty": "Le message est obligatoire"
  })
});
