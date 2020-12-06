require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
// const encrypt=require("mongoose-encryption");
const md5=require("md5");

const app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//////////////////////////// database connection mongodb~mongoose//////////////////////////
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});
const userSchema=new mongoose.Schema({
  userName:String,
  password:String
});

// userSchema.plugin(encrypt, { secret:process.env.SECRET,encryptedFields:["password"] });
const User= mongoose.model("User",userSchema);

///////////////////////////////////server functions/////////////////////////////////////////
app.get("/",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){
  const newUser= new User({
    userName:req.body.username,
    password:md5(req.body.password)
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    } else{
      console.log(err);
    }
  });
});

app.post("/login",function(req,res){
  const userName=req.body.username;
  const password=md5(req.body.password);

  User.findOne({userName:userName},function(err,foundUser){
    if(err){
      console.log(err);
    } else{
      if(foundUser){
        if(foundUser.password===password){
          res.render("secrets");
        }
      }
    }
  });
});




app.listen(3000,function(){
  console.log("server running on port 3000");
});
