import { contactSubmissionSchema } from "../validators/contact-validator.js";
import { StatusCodes } from "http-status-codes";

export function validateContactSubmission(req, res, next) {
  const validation = contactSubmissionSchema.validate(req.body, { abortEarly: false }); // Valider les données de la requête
  if (validation.error) {
    const errorMessages = validation.error.details.map((d) => d.message).join(", "); // Agréger les messages d'erreur
    return res.status(StatusCodes.BAD_REQUEST).render("contact", { // Rendre la page de contact avec les erreurs
      pagetitle: "| Contact",
      success: null,
      error: errorMessages, // Messages d'erreur de validation
      name: req.body.name || "", // Récupérer les valeurs soumises
      email: req.body.email || "", // Récupérer les valeurs soumises
      message: req.body.message || "" // Récupérer les valeurs soumises
    });
  }

  req.validatedData = validation.value; // Données validées
  next();
}
