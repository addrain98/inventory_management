const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const cors = require('cors'); 
require('dotenv').config()
const app = express();
app.use(cors()); 
app.use(express.json());
const { engine } = require('express-handlebars');
const { connect } = require("./mongoUtil");
const DB_NAME = process.env.DB_NAME;
const statusRoutes = require("./routes/status")

async function main() {
    const db = await connect(process.env.MONGO_URL, DB_NAME);
    app.set("view engine", "hbs");
    wax.on(hbs.handlebars);
    wax.setLayoutPath("./views/layouts");
    app.set("view engine", "hbs");
    app.use(express.urlencoded({ extended: false }));
    

   
    app.use('/status', statusRoutes)

  

}


main();

app.listen(3000, function () {
    console.log("Server has started");
})