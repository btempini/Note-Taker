const express = require("express");
const notesData = require("./db/db.json");
const path = require("path");
const PORT = 3001;

//Initiate
const app = express();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(notesData);
});

app.listen(PORT, () => {
  console.log(`Note Taker App listening at http://localhost:${PORT}`);
});
