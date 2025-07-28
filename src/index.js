const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require('./models/user')


app.use(express.json())

app.post('/signup',async(req,res)=>{
    const user = new User(req.body)

    try {
        await user.save();
        res.send("user saved successfully")
    } catch (error) {
        res.status(400).send("error saving data to user:"+ error.message)
    }
    
    
})

app.get("/user",async (req,res)=>{
    let email = req.body.email
    try {
         let user = await User.find({email: email})

        if(user.length === 0){
            res.status(404).send("user not found")
        }
        else{
            res.send(user)

        }
    } catch (error) {
        res.status(400).send("something went wrong")
    }
})

app.get("/feed",async (req,res)=>{
    try {
         let user = await User.find({})

        if(user.length === 0){
            res.status(404).send("no users found")
        }
        else{
            res.send(user)

        }
    } catch (error) {
        res.status(400).send("something went wrong")
    }
})

app.delete("/deleteUser", async(req,res)=>{
    let userId = req.body.userId
    try {
        await User.findByIdAndDelete(userId)
        res.send("user deleted successfully")
    } catch (error) {
        res.status(400).send("something went wrong")
    }
})

app.put("/updateUser", async(req,res)=>{
    let data = req.body
    try {
        await User.findOneAndUpdate( {email: data.email}, data)

        res.send("user updates successfully")
    } catch (error) {
        res.status(400).send("something went wrong")
    }
})
connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(3000, () => {
      console.log("listening to port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

