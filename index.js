const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const cors = require('cors'); 
require('dotenv').config()
const app = express();
app.use(cors()); 
app.use(express.json());
const { connect } = require("./mongoUtil");
const DB_NAME = process.env.DB_NAME;

async function main() {
    const db = await connect(process.env.MONGO_URL, DB_NAME);


   


    

  

}


main();

app.listen(3000, function () {
    console.log("Server has started");
})