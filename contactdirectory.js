// Antonio Hernandez
// INF656 Assignment 3 - Contact Directory
// Muvva
// 10 - 26 - 23

const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");

app.use(express.json()); // middleware

// Express Server
app.get("/", (req, res) => {
    res.send("Hello World!");
});

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
    res.join(contacts);
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
app.post("/contacts", (req, res) => {
    let contacts = readContacts();
    // let newContact = req.body;
    let newContact = {
        id: Date.now(),
        ...req.body
    };
    contacts.push(newContact);
    writeContacts(contacts);
    res.status(201).send("Contact added");
});

// put (update)
app.put("/contacts/:id", (req, res) => {
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

// Middleware validation
function validateContact(req, res, next) {
    const { name, phoneNumber, email } = req.body;
    if (!name || !phoneNumber || !email) {
        return res.status(400).send("Missing required fields");
    }

    next();

}

app.use("/contacts", validateContact);