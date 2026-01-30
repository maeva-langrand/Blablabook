import { Router } from "express";
export const profilRouter = Router();

import { editProfilPage, showProfilPage } from"../controllers/profil-controller.js";

profilRouter.get("/profil", showProfilPage)
profilRouter.post("/profil/update", editProfilPage)