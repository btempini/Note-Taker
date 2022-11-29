const express = require("express");
const notesData = require("./db/db.json");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { fstat } = require("fs");
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

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: uuidv4(),
    };

    const newNoteString = JSON.stringify(newNote);

    fs.readFile("./db/db.json", function (err, data) {
      var json = JSON.parse(newNoteString);
      // notesData.push(json);
      fs.writeFile("./db/db.json", JSON.stringify(json), function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
      });
    });

    //return new note to client?
    let response;

    if (req.body && req.body.text) {
      response = {
        status: "success",
        body: req.body,
      };
      res.status(201).json(response);
    } else {
      res.status(500).json("Error in posting note.");
    }
  }
});

app.listen(PORT, () => {
  console.log(`Note Taker App listening at http://localhost:${PORT}`);
});
