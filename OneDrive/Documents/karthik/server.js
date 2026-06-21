const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads

// MongoDB Connection
const MONGO_URI = 'mongodb://localhost:27017/inventory_db';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('Database connection error:', err));

// MongoDB Schema & Model
const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true }
}, { timestamps: true });

const Item = mongoose.model('Item', ItemSchema);

// --- REST API Endpoints ---

// 1. GET: Fetch all inventory items
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve items.' });
    }
});

// 2. POST: Create a new inventory item
app.post('/api/items', async (req, res) => {
    const { name, quantity, price } = req.body;
    try {
        const newItem = new Item({ name, quantity, price });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create item. Ensure all fields are valid.' });
    }
});

// 3. PUT: Update an existing inventory item by ID (ADDED FOR EDIT FUNCTION)
app.put('/api/items/:id', async (req, res) => {
    const { name, quantity, price } = req.body;
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { name, quantity, price },
            { new: true, runValidators: true } // Returns the updated document rather than the old one
        );

        if (!updatedItem) return res.status(404).json({ error: 'Item not found.' });
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update item. Ensure all fields are valid.' });
    }
});

// 4. DELETE: Remove an item by ID
app.delete('/api/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ error: 'Item not found.' });
        res.status(200).json({ message: 'Item deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete item.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});