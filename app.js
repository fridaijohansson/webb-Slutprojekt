const express = require('express');
const bodyParser  = require('body-parser');
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');


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

app.post('/register',function(req,res){
    upload(req,res, (err) =>{
        if(err){
            console.log(req.file);
            //rerender form
        } else{
            console.log(req.file);
            res.send('test');

            if(req.file == undefined){
                //Add standard profile image
            }else{
                //rerender uploaded
            }
        }
    });
    // ta in alla variabler

    //username, password, email, userID, profileIMG
});

app.listen(3600,()=> console.log('server started on port 3600'));

