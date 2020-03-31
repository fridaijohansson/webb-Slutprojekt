const express = require('express');
const mongo = require('mongodb').MongoClient;

const conString = "mongodb+srv://frijoh01:MiJa123@first-vi93c.mongodb.net/test?retryWrites=true&w=majority";
let app;
makeConnection();

async function makeConnection(){
    const con = await mongo.connect(conString,{useNewUrlParser: true, useUnifiedTopology: true});

    const db = await con.db('user');
    const col = await db.collection('posts');
    const col2 = await db.collection('booklists');
    const col3 = await db.collection('users');

    app = express();
    app.use(express.urlencoded({extended:false}));
    app.use(express.static("public"));
    app.listen(3600,function(){console.log('port:3600')});

    app.posts = col;
    app.booklists = col2;
    app.users = col3;
    require('./index')(app);
}