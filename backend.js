// 1. Import the Express library
const express = require('express');

// 2. Initialize the Express application
const app = express();

// 3. Define the port where the server will run
const PORT = 3000;

// 4. Create a "Route" (What happens when someone visits your website)
app.get('/', (req, res) => {
    res.send('Hello, World! This is my very first JavaScript backend server.');
});

// 5. Create a second route just for fun
app.get('/api/status', (req, res) => {
    res.json({ status: "online", message: "Backend is running perfectly!" });
});

// 6. Start the server and tell it to listen for requests
app.listen(PORT, () => {
    console.log(`Server is running! Open your browser and go to http://localhost:${PORT}`);
});