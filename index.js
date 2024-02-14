const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const cors = require('cors'); 
require('dotenv').config();
const { connect } = require("./mongoUtil");
const statusRoutes = require("./routes/status");
const categoryRoutes = require("./routes/category");

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded

// Handlebars setup
app.set("view engine", "hbs");
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// Adding handlebars helpers - if you actually use helpers in your templates, otherwise, this can be omitted.
const helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
});

// Connect to MongoDB
async function main() {
    try {
        await connect(process.env.MONGO_URL, process.env.DB_NAME);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
        process.exit(1); // Exit with error
    }
    //Routes
    app.use('/status', statusRoutes);
    app.use('/category', categoryRoutes);
}

main();



// Start server
app.listen(3000, function () {
    console.log("Server has started on port 3000");
});
