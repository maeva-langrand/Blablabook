import { Router } from "express";
import { showContactPage, submitContactForm } from "../controllers/contact-controller.js";
import { validateContactSubmission } from "../middlewares/contact.middleware.js";

export const contactRouter = Router();

contactRouter.get("/contact", showContactPage);
contactRouter.post("/contact", validateContactSubmission, submitContactForm);
