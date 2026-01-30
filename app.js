import "dotenv/config";
import express from "express";
import path from 'path'
import { fileURLToPath } from 'url'
import session from "express-session";

import { bookRouter } from "./app/routers/book-router.js";
import { authRouter } from "./app/routers/auth-router.js";
import { libraryRouter } from "./app/routers/library-router.js";
import { profilRouter } from "./app/routers/profil-router.js";

import { handleError } from "./app/middlewares/error-middleware.js"
import { contactRouter } from "./app/routers/contact-router.js";
import { showHomePage } from "./app/controllers/book-controller.js";

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* views engine*/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/views"));

/* statics */
app.use(express.static(path.join(__dirname, 'public')))

/* Body parser middleware */
/* middleware */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


/*Session cookies*/
app.use(session({
  name: "blablabook-session",
  secret: process.env.SESSION_SECRET || "blablabook-fallback-secret",
  resave: false,
  saveUninitialized: false,
  httpOnly: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

/* Rendering homepage */
app.get("/",showHomePage);


app.use(authRouter);
app.use(bookRouter);
app.use(libraryRouter);
app.use(contactRouter);
app.use(profilRouter);


app.use((req, res, next) => {
  next({type: 'PAGE_NOT_FOUND'});
});
app.use(handleError);

app.listen(PORT, () => {
  console.log(`📔 BlaBlaBook prêt : http://localhost:${PORT}`)
})