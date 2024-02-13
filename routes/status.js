const express = require('express');
const { getDB } = require('../mongoUtil');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const router = express.Router();
const COLLECTION = 'status';
// POST - Create a new item
router.post("/", async function (req, res) {
    try {
        const {status } = req.body; // status can be 'borrowed' or 'returned'
    
        // Validation
        if (!status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
    
        const newItem = { status };
        const result = await getDB().collection(COLLECTION).insertOne(newItem);
        res.status(201).json(result);
        res.redirect('/status/view'); 
    } catch (error) {
        res.status(500).json({ message: 'Error adding new item', error: error.message });
    }
});
router.get('/status', async (req, res) => {
    const statuses = await getDB().collection(COLLECTION).find({}).toArray();
    res.render('status', { statuses }); // Make sure this matches your `status.hbs` expectations
});

router.get('/', async (req, res) => {
    try {
        const statuses = await getDB().collection(COLLECTION).find({}).toArray();
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching status', error: error.message });
    }
});



// DELETE - Delete an item
router.delete("/:id", async function (req, res) {
    try {
        const statusId = req.params.id;
        const objectId = new ObjectId(statusId);
        const result = await getDB().collection(COLLECTION).deleteOne({ _id: objectId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item successfully deleted" });

    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error: error.message });
    }
});



module.exports = router;
