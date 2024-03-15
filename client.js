// Get all the needed HTML elements
const messagesList = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');

// Open a new websocket and connect to the server
const socket = new WebSocket('ws://localhost:3000');

// Sends a message, sets the message field back to empty after sending
const sendMessage = () => {
    const message = messageInput.value; // Get the message value from the input field
    socket.send(message); // Send message to the server
    messageInput.value = '';
};

// Display the incoming message
// Server messages are colored grey
socket.onmessage = (e) => {
    // Create a new list item
    const messageListItem = document.createElement('li');
    // Set the text of the list item
    messageListItem.textContent = e.data;
    // Change display to block to remove the list item dots
    messageListItem.style.display = 'block';
    // Server messages shown in grey color
    if (e.data.startsWith('Server:')) {
        messageListItem.style.color = 'grey';
    };
    // Add the list item to the messages list
    messagesList.appendChild(messageListItem);
};

// Event listener for the send-button
sendButton.addEventListener('click', sendMessage);