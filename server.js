
const express = require("express");
const fs = require("fs");
const path = require("path");
const nanoid = require("nanoid"); 

const dbFile = "./develop/db/db.json";
const publicIndexFile = "/develop/public/index.html";
const publicNotesFile = "/develop/public/notes.html";

var app = express();
var PORT = process.env.PORT || 3000;

let noteContent = [];

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));


app.route("/api/notes")
    .get((req, res) => {
        fs.readFile(dbFile, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            res.send(JSON.parse(data));
        })
    });


//new note
app.route("/api/notes")
    .post((req, res) => {
        let jsonFilePath = path.join(__dirname, dbFile);
        let noteContent = req.body;
        let id = Date.now(); 

        fs.readFile(jsonFilePath, function (err, data) {
            let json = JSON.parse(data); 
            json.push({
                id: id,
                title: noteContent.title,
                text: noteContent.text
            });

            fs.writeFile(jsonFilePath, JSON.stringify(json), function (err) {
                if (err) {
                    console.log(err);
                }
                res.send(noteContent);
            });
        });
    });

//delete note

app.route("/api/notes/:id")
    .delete((req, res) => { 
        let jsonFilePath = path.join(__dirname, dbFile);
        let notes;

        fs.readFile(jsonFilePath, function (err, data) {
            notes = JSON.parse(data);
            console.log(notes);

        if (notes.length === 0) {}

        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id == req.params.id) {
                notes.splice(i, 1);
                break;
            }
        } 

        fs.writeFileSync(jsonFilePath, JSON.stringify(notes), function (err) {

            if (err) {
                return console.log(err);
            } else {
                console.log("Note deleted");
            }
        });
        res.send(notes);
    });
    });


app.get("/notes", ((req, res) => {
    res.sendFile(path.join(__dirname, publicNotesFile));
}));

app.get("*", ((req, res) => {
    res.sendFile(path.join(__dirname, publicIndexFile));
}));

//listener
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});