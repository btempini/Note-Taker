const express = require("express");
const notesData = require("./db/db.json");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { json } = require("express");
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
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const newData = JSON.parse(data);
      res.json(newData);
    }
  });
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: uuidv4(),
    };

    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 2),
          (writeErr) => {
            writeErr
              ? console.error(writeErr)
              : console.info("successfully added note");
          }
        );
      }
    });

    const response = {
      status: "success",
      body: notesData,
    };
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting review");
  }
});

app.listen(PORT, () => {
  console.log(`Note Taker App listening at http://localhost:${PORT}`);
});
