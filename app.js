const express = require('express');
const bodyParser  = require('body-parser');
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');
const bcrypt = require("bcryptjs");
const fs = require('fs');


//set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }  //ändra filnamnen till userID senare
});

//init upload
const upload = multer({
    storage:storage,
    limits:{fileSize:1000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('img');

//check file
function checkFileType(file,cb){
    //allowed extensions
    const filetypes = /jpeg|jpg|png/;
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('Error: images only!');
    }
}


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//ejs
// app.set('view engine', 'ejs');

app.use(express.static('./public'));


app.get('/' ,function(req,res){
    res.sendFile(__dirname+'/register.html');0
});

// app.get('/', (req,res)=> res.render('index'));

app.post('/register', async function(req,res){
    await upload(req,res, (err) =>{
        if(err){
            console.log(req.file);
            //rerender form
        } else{
            

            if(req.file == undefined){
                //Add standard profile image
            }else{
                //rerender uploaded
                console.log(req.file);
                res.redirect('/');
            }
        }
    });
    // ta in alla variabler

    //username, password, email, userID, profileIMG
    //
    let user = {...req.body};

    // jämför password och confirm-pass


    user.password = await bcrypt.hash(user.password,12);
    // hämta random kod från funktion längst ned i filen
    let code = randomCode();
    // kryptera koden 
    let hash = await bcrypt.hash(code,12);

    const userID = 123;
    
    let input = {
        user,
        userID,
        verified: false
     };
    res.send(input);

    //let data = JSON.stringify(input, null, 2);
    let filedata = JSON.parse(fs.readFileSync('./public/user.json'));
    filedata.push(input);
    fs.writeFileSync('./public/user.json', JSON.stringify(filedata));
    
    
});

app.listen(3600,()=> console.log('server started on port 3600'));


//hashnings kåd
function randomCode(){
    const crypto = require('crypto');
    const code = crypto.randomBytes(6).toString("hex");
    console.log(code);
    return code;
}