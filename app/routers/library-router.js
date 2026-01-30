import { Router } from "express";
import { showLibraryPage, addBookToLibrary, removeBookFromLibrary } from "../controllers/library-controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const libraryRouter = Router();

libraryRouter.get("/bibliotheque",  requireAuth, showLibraryPage);
libraryRouter.post("/bibliotheque",  requireAuth, addBookToLibrary);
libraryRouter.patch('/bibliotheque/retirer', requireAuth, removeBookFromLibrary);
