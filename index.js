const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory data store using a hashmap
const dataStore = {};
let nextId = 1;

// 1. Create a new item
app.post('/api/items', (req, res) => {
    const item = req.body;
    if (!item) {
        return res.status(400).json({ error: 'Item data is required' });
    }
    
    const id = nextId++;
    item.id = id;
    dataStore[id] = item;
    
    res.status(201).json(item);
});

// 2. Get an item by ID
app.get('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (dataStore[id]) {
        res.json(dataStore[id]);
    } else {
        res.status(404).json({ error: `Item with id ${id} not found` });
    }
});

// 3. Get all items
app.get('/api/items', (req, res) => {
    const items = Object.values(dataStore);
    res.json(items);
});

// 4. Update an item by ID
app.put('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (!dataStore[id]) {
        return res.status(404).json({ error: `Item with id ${id} not found` });
    }
    
    const updatedItem = req.body;
    updatedItem.id = id; // Ensure ID remains the same
    dataStore[id] = updatedItem;
    
    res.json(updatedItem);
});

// 5. Delete an item by ID
app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (!dataStore[id]) {
        return res.status(404).json({ error: `Item with id ${id} not found` });
    }
    
    delete dataStore[id];
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});