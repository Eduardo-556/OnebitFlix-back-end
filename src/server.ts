import express from "express";
import { database } from "./database";

const app = express();

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
  database.authenticate().then(() => {
    console.log("DB connection successfull.");
  });

  console.log(`Server started successfuly at port ${PORT}.`);
});
