require('dotenv').config() 
const express = require("express");
const bodyParser = require("body-parser")
const ejs = require ("ejs")


const mongoose = require ("mongoose")
var encrypt = require('mongoose-encryption');


const app = express()
app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))


mongoose.connect("mongodb+srv://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@cluster0.ueqgbuk.mongodb.net/UserDB?retryWrites=true&w=majority");


const userSchema = new mongoose.Schema({
   email: String,
   password: String
});


//const secret = "ThisisSecret";
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});


const User = new mongoose.model("User", userSchema);

console.log(process.env.SECRET) 

app.get("/register", (req,res)=> {
   res.render("register");
})
app.get("/login", (req,res)=> {
   res.render("login");
})
app.get("/secrets", (req,res)=> {
   res.render("secrets");
})


app.post("/register", (req, res) => {
   const newUser = new User ({
       email: req.body.username,
       password: req.body.password
   });


   newUser.save((err) => {
       if (err) console.log (err)
       else res.render("secrets")
   })
})


app.post("/login", (req, res)=>{


   const username = req.body.username;
   const password = req.body.password;


   User.findOne({email: username}, (err, foundUser) => {
       if (err) console.log(err)
       else {
           if (foundUser) {
               if (foundUser.password === password) res.render("secrets");
           }
       }
   });
});


app.get("/logout", (req,res)=>{
 
   res.redirect("/")
})


app.get("/", (req,res)=> {
   res.render("home");
});


app.listen (3000, () => {
   console.log("Server opened on port 3000")
})



