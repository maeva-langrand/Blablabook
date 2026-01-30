import { Router } from "express";
import { showLoginPage, showRegisterPage, registerUser, login, logout, showForgotPasswordPage, forgotPassword, showResetPasswordPage, resetPassword } from "../controllers/auth-controller.js";
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.get("/login", showLoginPage);
authRouter.get("/register", showRegisterPage);
authRouter.post("/register", validateRegister, registerUser);
authRouter.post("/login", validateLogin, login);
authRouter.get("/logout", logout);
authRouter.get("/forgot-password", showForgotPasswordPage);
authRouter.post("/forgot-password", validateForgotPassword, forgotPassword);
authRouter.get("/reset-password", showResetPasswordPage);
authRouter.post("/reset-password", validateResetPassword, resetPassword);