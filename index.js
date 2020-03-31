const objectId = require('mongodb').ObjectId;
const express = require('express');
const bodyParser  = require('body-parser');
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');
const bcrypt = require("bcryptjs");
const fs = require('fs');
const login = require('./login');


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
    try {
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

        const userexist =  await app.users.findOne({email: req.body.email});
        if(!userexist){
            const user = req.body;
            delete user.confPassword;
            const userID = Date.now();

            //fixa middleware i början av funktionen
            user.password = await bcrypt.hash(user.password,12);
            // hämta random kod från funktion längst ned i filen
            let code = randomCode();
            // kryptera koden 
            let hash = await bcrypt.hash(code,12);

            

            let input = {
                user,
                userID,
                verified: false
            };


            await app.users.insertOne(input);
        }
        else{
            res.send("no user was created");
        }
    }
    catch (error) {
         res.send("error");
    }


     /*
    

    // ta in alla variabler


    //username, password, email, userID, profileIMG
    let user = {...req.body};
    
    // ta bort confirm password

    


    
    
    
    res.send(input);

    //let data = JSON.stringify(input, null, 2);
    let filedata = JSON.parse(fs.readFileSync('./public/user.json'));
    filedata.push(input);
    fs.writeFileSync('./public/user.json', JSON.stringify(filedata));
    */
    
});




//hashnings code
function randomCode(){
    const crypto = require('crypto');
    const code = crypto.randomBytes(6).toString("hex");
    console.log(code);
    return code;
}





app.get("/login", function(req, res){
    res.sendFile(__dirname+"/login.html");

});
app.post("/login", login,function(req, res){
    
    // Hämta våra användare från db/fil
    const users = require("./users");

    const user = users.filter(function(u){
        return req.body.email === u.email
    });

    // Om vi har en och exakt en användare med rätt email
   if(user.length===1)
   {

        // kolla lösenord
        bcrypt.compare(req.body.password,user[0].password,function(err,success){

            if(success){
                
               // res.cookie("auth",true,{httpOnly:true,sameSite:"strict"});
               
               const token = jwt.sign({email:user[0].email},secret,{expiresIn:60});
               res.cookie("token",token,{httpOnly:true,sameSite:"strict"}); 
               res.send("Login Success!!!!!!!");
            }
            else{
                res.send("Wrong Password");
            }
        })
   }
   else
   {
        res.send("no such user");
   }
});

app.get("/logout", function(req,res){
    
    res.cookie("token","snart är det jul");
    res.redirect(__dirname + "/startsida.html");

});



app.get('/first-page', function(req,res){
    res.sendFile(__dirname + '/first-page.html');
});



















app.listen(3600,()=> console.log('server started on port 3600'));