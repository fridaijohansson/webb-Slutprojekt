/*const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser  = require('body-parser');
const multer = require('multer');


//initiera applikationen
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




// använd fileupload som middleware för samtliga routes.
app.use(fileUpload());

app.use(express.static(__dirname +'/public'));

// Get-route för att köra html-fil med formulär i.
app.get('/' ,function(req,res){
    res.sendFile(__dirname+'/register.html');0
});

// post-route
app.post('/register', function(req, res) {

    

  const finalFileName = req.body.filename;
    // om längden på filobjektet är lika med noll
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // Sista delen i detta är namnet som input-fältet heter. dvs file
  let myFile = req.files.file;
  // Observera att myFile är ett objekt som innehåller massa info om filen.

    console.log(myFile);
  // mv() är en funktion som flyttar filen från temporär plats på servern till en katalog som du själv skapat på servern
  // i vårt fall heter katalogen uploads
  // här använder jag text fån det andra inputfältet och sätter ihop det med rätt filändelse.
    myFile.mv(__dirname+'/uploads/'+finalFileName+'.'+myFile.name.split('.')[1], function(err) {
    if (err)
        return res.status(500).send(err);

        res.send('File uploaded!');
  });
});




app.listen(3500,()=>console.log("lyssnar på 3500")); */