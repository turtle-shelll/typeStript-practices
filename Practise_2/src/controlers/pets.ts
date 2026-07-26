import petDTO from "../DTOs/petDTO.js";
import petsData from "../demoDB/petsData.js";

import type { Request, Response } from "express";

const getAllPets = (req:Request, res:Response) => {
    res.status(200).json(petsData);
    res.end();
};

const getPetByName = (req:Request, res:Response):void => {
    const { name } = req.params;
    const pet = petsData.find(p => p.name === name);
    if (!pet) {
        res.status(404).json({ message: "Pet not found" });
        res.end();
        return;
    };
    res.status(200).json(pet);
    res.end();
};

const addPet = (req:Request, res:Response):void => {
    const { name, species, adopted, age } = req.body;
    if (!name || !species || !adopted || !age) {
        res.status(400).json({ message: "All fields are required" });
        res.end();
        return;
    };
    const newPet: petDTO = { name, species, adopted, age };
    petsData.push(newPet);
    res.status(201).json({ message: "Pet added successfully", pet: newPet, status: "success" });
    res.end();
};

export { getAllPets, getPetByName, addPet };