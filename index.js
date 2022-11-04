const express = require("express");
const { connection } = require("./config/db");
const { UserModel } = require("./model/user.model");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const notesRouter = require("./routes/notes.routes");
require('dotenv').config()
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to homepage");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
 await bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      return res.send("signup failed fill all and correct things");
    }
    const new_user = new UserModel({
      email,
     password:hash,
    });
     new_user.save();
    return res.send("signup successful");
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userData = await UserModel.findOne({ email });
  console.log(userData);
  console.log(userData.email,userData._id,userData.password)
  if (!userData) {
    return res.send("Invalid Credentials");
  }
  const hashed_password = userData.password;
  await bcrypt.compare(password, hashed_password, function (err, result) {
    if (err) {
      return res.send("something went wrong");
    }
    if (result == true) {
      const token = jwt.sign({ email: userData.email, _id: userData._id },"process.env.SECRET_KEY");
      return res.send({ message: "Login successful", token: token });
    } else {
      return res.send("Invalid Credentials");
    }
  });
});


const middleware = (req,res,next)=>{
if(!req.headers.authorization){
 return res.send("login again")
}

const token = req.headers.authorization.split(" ")[1]
jwt.verify(token, 'process.env.SECRET_KEY', function(err, decoded) {
 if(err){
 return res.send("login again")
 }
 else{
 next()
 }
                     // err
                     // decoded undefined
                   });
console.log(token)
}


app.use(middleware)
app.use("/notes",notesRouter)

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to db successfully");
  } catch (err) {
    console.log("err to connected db");
  }
  console.log("server started at http://localhost:8080");
});
