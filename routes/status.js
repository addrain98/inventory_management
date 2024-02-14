const express = require('express');
const { getDB } = require('../mongoUtil');
const { ObjectId } = require('mongodb');
const router = express.Router();
const COLLECTION = 'status';

// POST - Create a new item
router.post("/", async function (req, res) {
    try {
        const { status } = req.body; // status can be 'borrowed' or 'returned'
    
        // Validation
        if (!status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
    
        const newStatus = { status };
        const result = await getDB().collection(COLLECTION).insertOne(newStatus);
        res.redirect('/status')

    } catch (error) {
        res.status(500).json({ message: 'Error adding new item', error: error.message });
    }
});

// GET - Display items in a Handlebars view
router.get('/', async (req, res) => {
    try {
        const statuses = await getDB().collection(COLLECTION).find({}).toArray();
        res.render('status', { statuses }); // Adjust this to match your `status.hbs` structure
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statuses', error: error.message });
    }
});

// DELETE - Delete an item
router.get('/delete/:id', async (req, res) => {
    try {
        const statusId = req.params.id;
        const objectId = new ObjectId(statusId);
        const result = await getDB().collection(COLLECTION).find({objectId}).toArray();
        if (result) {
            res.json(result);
        }

    } catch (error) {
        res.status(500).json({ message: 'Error fetching item', error: error.message });
    }
});

router.post("/delete/:id", async function (req, res) {
    try {
        const statusId = req.params.id;
        const objectId = new ObjectId(statusId);
        const result = await getDB().collection(COLLECTION).deleteOne({ _id: objectId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Status not found" });
        }
        res.redirect('/status');
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error: error.message });
    }
});

module.exports = router;

