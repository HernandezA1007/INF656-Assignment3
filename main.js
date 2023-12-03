document.addEventListener("DOMContentLoaded", fetchContacts);

const backendUrl = "http://localhost:3000";
let editingContactId = null;

function fetchContacts() {
    fetch(backendUrl + "/contacts")
    .then(response => response.json())
    .then(contacts => {
        const contactsList = document.getElementById("contactsList");
        contactsList.innerHTML = ""; // Clear the list before adding new items
        contacts.forEach(contact => {
            const contactDiv = document.createElement("div");
            contactDiv.className = "contact-item";
            // contactDiv.innerHTML = `
            //     <h3>${contact.name}</h3>
            //     <p>Phone: ${contact.phone}</p>
            //     <p>Email: ${contact.email}</p>
            //     <p>Address: ${contact.address || 'N/A'}</p>
            //     <button onclick="populateForm(${JSON.stringify(contact)})">Edit</button>
            //     <button onclick="deleteContact(${contact.id})">Delete</button>
            // `;
            contactDiv.innerHTML = `
                <h3>${contact.name}</h3>
                <p>Phone: ${contact.phone}</p>
                <p>Email: ${contact.email}</p>
                <p>Address: ${contact.address || 'N/A'}</p>
                <button onclick='populateForm(${JSON.stringify(contact).replace(/'/g, "&#39;")})'>Edit</button>
                <button class='delete-button' onclick='deleteContact(${contact.id})'>Delete</button>
            `;
            contactsList.appendChild(contactDiv);
        });
    })
    .catch(error => console.error("Error:", error));
}
/*function fetchContacts() {
    fetch(backendUrl + "/contacts")
    .then(response => response.json())
    .then(contacts => {
        const contactsList = document.getElementById("contactsList");
        //contactsList.innerHTML = ""; // Clear the list before adding new items
        contacts.forEach(contact => {
            const contactDiv = document.createElement("div");
            contactDiv.className = "contact-item";
            contactDiv.innerHTML = `
                <h3>${contact.name}</h3>
                <p>Phone: ${contact.phone}</p>
                <p>Email: ${contact.email}</p>
                <p>Address: ${contact.address || 'N/A'}</p>
                <button onclick="deleteContact(${contact.id})">Delete</button>
            `;
            contactsList.appendChild(contactDiv);
        });
    })
    .catch(error => console.error("Error:", error));
}*/

document.getElementById("addContactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    const contactData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value
    };

    if (editingContactId !== null) {
        updateContact(editingContactId, contactData);
    } else {
        addNewContact(contactData);
    }
});

function addNewContact(contact) {
    fetch(backendUrl + "/contacts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contact)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        fetchContacts();
    })
    .catch(error => console.error("Error:", error));
}

function updateContact(id, contact) {
    fetch(`${backendUrl}/contacts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contact)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        fetchContacts();
        editingContactId = null;
        document.getElementById("addContactForm").reset();
    })
    .catch(error => console.error("Error:", error));
}

function deleteContact(contactId) {
    fetch(`${backendUrl}/contacts/${contactId}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => fetchContacts())
    .catch(error => console.error("Error:", error));
}

function populateForm(contact) {
    document.getElementById('name').value = contact.name;
    document.getElementById('phone').value = contact.phone;
    document.getElementById('email').value = contact.email;
    document.getElementById('address').value = contact.address || '';
    editingContactId = contact.id;
}

// fetchContacts(); test