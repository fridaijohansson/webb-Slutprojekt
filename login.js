const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("./secret");
const users = require("./users");


module.exports = function(req,res, next){
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
               next();
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

}