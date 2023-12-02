function fetchContacts() {
    fetch("/contacts")
    .then(response => response.json())
    .then(contacts => {
        // code to display contacts in contactList div
    })
    .catch(error => console.error("Error:", error));
}

fetchContacts();