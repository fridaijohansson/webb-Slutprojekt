const objectId = require('mongodb').ObjectId;
const express = require("express");
const app = express();
app.use(express.urlencoded({extended:false}));

 module.exports = async function(user){

    await app.users.insertOne(user);


 };