// Antonio Hernandez
// INF656 Assignment 3 - Contact Directory
// Muvva
// 10 - 26 - 23

const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const cors = require("cors");

app.use(express.static("public"));

app.use(cors());
app.use(express.json()); // Middleware for JSON

// FS functions for contacts.json
function readContacts() {
    let rawData = fs.readFileSync("contacts.json");
    return JSON.parse(rawData);
}

function writeContacts(contacts) {
    let data = JSON.stringify(contacts, null, 2);
    fs.writeFileSync("contacts.json", data);
}

// GET all contacts
app.get("/contacts", (req, res) => {
    let contacts = readContacts();
    res.json(contacts);
});

// Middleware validation for POST, PUT, DELETE
function validateContact(req, res, next) {
    const { name, phone, email } = req.body;
    if (!name || !phone || !email) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    next();
}

// POST (ADD)
app.post("/contacts", validateContact, (req, res) => {
    let contacts = readContacts();
    let newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    let newContact = { id: newId, ...req.body };
    contacts.push(newContact);
    writeContacts(contacts);
    res.status(201).json(newContact);
});

// PUT (UPDATE)
app.put("/contacts/:id", validateContact, (req, res) => {
    let contacts = readContacts();
    let index = contacts.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
        contacts[index] = { ...contacts[index], ...req.body };
        writeContacts(contacts);
        res.json(contacts[index]);
    } else {
        res.status(404).json({ error: "Contact not found" });
    }
});

// DELETE 
app.delete("/contacts/:id", (req, res) => {
    let contacts = readContacts();
    let index = contacts.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
        contacts.splice(index, 1);
        writeContacts(contacts);
        res.status(204).send();
    } else {
        res.status(404).json({ error: "Contact not found" });
    }
});


app.get("/", (req, res) => {
    res.send("Contact Directory API");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});