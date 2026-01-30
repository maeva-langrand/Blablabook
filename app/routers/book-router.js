import { Router } from "express";
export const bookRouter = Router();
import { showBooksPage, showBookDetailsPage, submitReview, updateReview, deleteReview } from "../controllers/book-controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateReviewSubmission, validateReviewUpdate } from "../middlewares/review.middleware.js";

bookRouter.get("/livres", showBooksPage);
bookRouter.get("/livre/:id", showBookDetailsPage);

// Review routes
bookRouter.post("/livre/:id/review", requireAuth, validateReviewSubmission, submitReview);
bookRouter.post("/livre/:id/review/update", requireAuth, validateReviewUpdate, updateReview);
bookRouter.post("/livre/:id/review/delete", requireAuth, deleteReview);