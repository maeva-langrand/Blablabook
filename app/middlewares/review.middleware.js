import { reviewSubmissionSchema, reviewUpdateSchema } from "../validators/review-validator.js";

// POST
export function validateReviewSubmission(req, res, next) {
  const validation = reviewSubmissionSchema.validate(req.body, { abortEarly: false, });

  if (validation.error) {
    const errorMessages = validation.error.details
      .map(d => d.message)
      .join(", ");

    return res.redirect(`/livre/${req.params.id}?error=${encodeURIComponent(errorMessages)}`);
  }

  req.validatedData = validation.value;
  next();
}

// PATCH
export function validateReviewUpdate(req, res, next) {
  const validation = reviewUpdateSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errorMessages = validation.error.details
      .map(d => d.message)
      .join(", ");

    return res.redirect(`/livre/${req.params.id}?error=${encodeURIComponent(errorMessages)}`);
  }

  req.validatedData = validation.value;
  next();
}
