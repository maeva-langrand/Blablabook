import Joi from "joi";

export const reviewSubmissionSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
      "number.base": "La note doit être un nombre",
      "number.integer": "La note doit être un entier",
      "number.min": "La note doit être au minimum 1",
      "number.max": "La note doit être au maximum 5",
      "any.required": "La note est obligatoire"
    }),

  review: Joi.string().trim().min(5).max(2000).required().messages({
      "string.empty": "L'avis est obligatoire",
      "string.min": "L'avis doit contenir au moins 5 caractères",
      "string.max": "L'avis ne doit pas dépasser 2000 caractères"
    })
});

export const reviewUpdateSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .messages({
      "number.base": "La note doit être un nombre",
      "number.integer": "La note doit être un entier",
      "number.min": "La note doit être au minimum 1",
      "number.max": "La note doit être au maximum 5"
    }),

  review: Joi.string()
    .trim()
    .min(5)
    .max(2000)
    .messages({
      "string.min": "L'avis doit contenir au moins 5 caractères",
      "string.max": "L'avis ne doit pas dépasser 2000 caractères"
    })
})
  // Oblige au moins un champ lors du PATCH
  .min(1)
  .messages({
    "object.min": "Vous devez modifier au moins un champ."
  });