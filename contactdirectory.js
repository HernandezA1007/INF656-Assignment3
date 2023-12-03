// Antonio Hernandez
// INF656 Assignment 3 - Contact Directory
// Muvva
// 10 - 26 - 23

const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const cors = require("cors");

app.use(cors());
app.use(express.json()); // middleware for JSON

// Middleware validation
function validateContact(req, res, next) {
    const { name, phone, email } = req.body;
    if (!name || !phone || !email) {
        // return res.status(400).send("Missing required fields");
        return res.status(400).json({ error: "Missing required fields" });

    }
    next();
}

app.use("/contacts", validateContact);

app.use(express.static(".")); // index.html or front end

// Express Server
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Routes...

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})

// FS
function readContacts() {
    let rawData = fs.readFileSync("contacts.json");
    return JSON.parse(rawData);
}

function writeContacts(contacts) {
    let data = JSON.stringify(contacts, null, 2);
    fs.writeFileSync("contacts.json", data);
}

// get all contacts
app.get("/contacts", (req, res) => {
    let contacts = readContacts();
    res.json(contacts);
});

// get one contact
app.get("/contacts/:id", (req, res) => {
    let contacts = readContacts();
    let contact = contacts.find(c => c.id == req.params.id);
    if (contact) {
        res.json(contact);
    } else {
        res.status(404).send("Contact not found");
    }
});

// post (add)
app.post("/contacts", validateContact, (req, res) => {
    let contacts = readContacts();
    // let newContact = req.body;
    let newId = contacts.length > 0 ? Math.max(...contacts.map(contact => contact.id)) + 1 : 1;
    let newContact = {
        // id: Date.now(),
        // id: contacts.length + 1,
        id: newId,
        ...req.body
    };
    contacts.push(newContact);
    writeContacts(contacts);
    res.status(201).send("Contact added");
});

// put (update)
app.put("/contacts/:id", validateContact, (req, res) => {
    let contacts = readContacts();
    let index = contacts.findIndex(c => c.id == req.params.id);
    if (index !== -1) {
        contacts[index] = {...contacts[index], ...req.body};
        writeContacts(contacts);
        res.send("Contact updated");
    } else {
        res.status(404).send("Contact not found");
    }
});

// delete
app.delete("/contacts/:id", (req, res) => {
    let contacts = readContacts();
    let index = contacts.findIndex(c => c.id == req.params.id);
    if (index !== -1) {
        contacts.splice(index, 1);
        writeContacts(contacts);
        res.send("Contact deleted");
    } else {
        res.status(404).send("Contact not found");
    }
});
