const express = require('express');
const { getDB } = require('../mongoUtil');
const { ObjectId } = require('mongodb');
const router = express.Router();
const COLLECTION = 'category';

// POST - Create a new item
router.post("/", async function (req, res) {
    try {
        const { category } = req.body; // status can be 'borrowed' or 'returned'
    
        // Validation
        if (!category) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
    
        const newCategory = { category };
        const result = await getDB().collection(COLLECTION).insertOne(newCategory);
        res.redirect('/category');

    } catch (error) {
        res.status(500).json({ message: 'Error adding new item', error: error.message });
    }
});

// GET - Display items in a Handlebars view
router.get('/', async (req, res) => {
    try {
        const categories = await getDB().collection(COLLECTION).find({}).toArray();
        res.render('category', { categories }); // Adjust this to match your `status.hbs` structure
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statuses', error: error.message });
    }
});

router.get('/delete/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const objectId = new ObjectId(categoryId);
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
        const categoryId = req.params.id;
        const objectId = new ObjectId(categoryId);
        const result = await getDB().collection(COLLECTION).deleteOne({ _id: objectId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.redirect('/category');
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
});

module.exports = router;