const ws = require('ws');
const WebSocketServer = ws.Server; // WebSocket server
const wss = new WebSocketServer({port: 3000}); // The server and port number for it
const clients = []; // List of connected clients
let runningId = 1;

// Method to handle commands that a client has sent
const command = (cmd, cli) => {
    // A case for each of the available commands
    switch (true) {
        case cmd.startsWith('/help'):
            cli.send('Server: This is a very helpful help message. Available commands: /help, /quit');
            break;
        
        case cmd.startsWith('/quit'):
            cli.send('Server: Disconnected from the server.');
            cli.close(); // Close client connection
            break;

        default: // Do nothing and send a error message as default
            cli.send('Server: Unknown command. Use /help to see available commands.');
            break;
    }
};

// Broadcast (send) message to all of the connected clients
const broadcast = (message, senderCli) => {
    // Add the id-number of a client in the start of a message
    const messageToSend  = `Client ${senderCli.id}: ${message}`;
    // Send the message to all of the connected clients
    clients.forEach((cli) => {
        cli.send(messageToSend);
    });
};

// Determine if the message is a command or a regular message
// Call 'command' or 'broadcast' method based on that
const onMessage = (message, cli) => {
    const messageString = message.toString();
    if (messageString.startsWith('/')) {
        command(messageString, cli);
    } else {
        broadcast(messageString, cli);
    }
};

// Initialisation handler for new connected clients 
// Gives an id for new clients and adds them to the clients-array
// Also specify a handler for the messages that the client sends
const onConnect = (cli) => {
    // Add an id-number to the new client
    cli.id = runningId++;
    // Add the new client to the clients-array
    clients.push(cli);
    console.log(`New client connected. Connected clients: ${clients.length}`);

    // Handle incoming messages from clients
    cli.on('message', (message) => onMessage(message, cli));

    cli.on('close', () => {
        // Remove a client from the array of clients if the connection closes
        clients.splice(clients.indexOf(cli), 1);
        console.log(`Client disconnected. Connected clients: ${clients.length}`);
    });
};

// Listen for new clients and handle client initialisation 
wss.on('connection', onConnect);