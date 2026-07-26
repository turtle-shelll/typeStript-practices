import express from "express";
import type { Router } from "express";

import { getAllPets, addPet, getPetByName } from "../controlers/pets.js";

const router:Router = express.Router();

router.get("/pets", getAllPets);
router.get("/pets/:name", getPetByName);
router.post("/pets", addPet);


export default router;

