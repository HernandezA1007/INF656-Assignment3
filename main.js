document.addEventListener("DOMContentLoaded", fetchContacts);


const backendUrl = "http://localhost:3000";

function fetchContacts() {
    fetch(backendUrl + "/contacts")
    .then(response => response.json())
    .then(contacts => {
        // 
        const contactsList = document.getElementById("contactsList");
        contactsList.innerHTML = "";
        contacts.forEach(contact => {
            const contactDiv = document.createElement("div");
            contactDiv.className = "contact-item";
            contactDiv.innerHTML = `
            <h3>${contact.name}</h3>
            <p>Phone: ${contact.phone}</p>
            <p>Email: ${contact.email}</p>
            <p>Address: ${contact.address || 'N/A'}</p>
            <button onclick="deleteContact('${contact.id}')">Delete</button>
            <!-- more buttons more functionality -->
            `;
            contactsList.appendChild(contactDiv);
        });
    })
    .catch(error => console.error("Error:", error));
}

document.getElementById("addContactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    const newContact = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value
    };

    fetch(backendUrl + "/contacts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newContact)
    })
    .then(response => {
        if (response.ok) {
            return fetchContacts(); // Refresh the contact list
        }
        throw new Error('Network response was not ok.');
    })
    .catch(error => console.error("Error:", error));
});

function deleteContact(contactId) {
    fetch(backendUrl + `/contacts/${contactId}`, {method: "DELETE"})
    .then(() => fetchContacts())
    .catch(error => console.error("Error:", error));
}

// fetchContacts(); test