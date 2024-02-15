const express = require('express');
const { getDB } = require('../mongoUtil');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const router = express.Router();


router.post("/create", async function (req, res) {
    // anything retrieved is from req.body is a string, not number
    try {
        const { name, category, quantity, location, status } = req.body;
        // Validation
        if (!name || !category || !quantity || !location || !status) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }


        const newItem = { name, category, quantity, location, status };
        const result = await getDB().collection('inventory').insertOne(newItem);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error adding new product', error: error.message });
    }

});

router.get('/create', async (req, res) => {
    try {
        const categories = await getDB().collection('category').find({}).toArray();
        const statuses = await getDB().collection('status').find({}).toArray();
        res.render('itemCreationForm', { categories, statuses }); // Assuming 'itemCreationForm' is your template
    } catch (error) {
        res.status(500).json({ message: 'Error loading form', error: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const items = await getDB().collection('inventory').find({}).toArray();
        // Fetch and map Categories
        const categoryIds = items.reduce((acc, item) => acc.concat(item.category || []), []);
        const categories = await getDB().collection('category').find({ _id: { $in: categoryIds } }).toArray();
        const categoryMap = {};
        categories.forEach(category => categoryMap[category._id] = category);

        // Fetch and map UOMs
        const statusIds = items.map(item => item.status && item.status._id).filter(id => id);
        const statuses = await getDB().collection('status').find({ _id: { $in: statusIds } }).toArray();
        const statusMap = {};
        statuses.forEach(status => statusMap[status._id] = status);

        // Enrich products with UOM and Category
        products.forEach(item => {
            if (item.status && statusMap[item.status._id]) {
                item.status = statusMap[item.status._id];
            }
            if (item.category) {
                item.category = item.category.map(categoryId => categoryMap[categoryId] || categoryId);
            }
        });

        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

module.exports = router