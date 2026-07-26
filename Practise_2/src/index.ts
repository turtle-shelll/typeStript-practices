import express from "express";
import type { Express } from "express";

import petRoutes from "./routes/petsRoute.js";

const apiBaseVersion:string = "/api/v1";
const PORT:number = 3000;
const app:Express = express();

app.use(apiBaseVersion, petRoutes);
app.get("/", (req, res):void => {
  res.send("Hello, World!");
  res.end();
});


app.listen(PORT, (): void => {
  console.log(`Server is running on http://localhost:${PORT}`);
});