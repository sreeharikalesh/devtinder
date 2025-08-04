const jwt = require('jsonwebtoken');
const User = require("../models/user")
const userAuth = async (req, res, next)=>{

    try {
        const { token } = req.cookies

        console.log(token);
        if(!token){
            throw new Error("invalid token");
        }

        const decodedObj = jwt.verify(token, "Sreehari@dev")
        console.log(decodedObj);

        let {_id} = decodedObj;
        
        let user = await User.findById({_id})

        // console.log("this is the user==>", user);
        if(!user){
            throw new Error("user not found");
        }

        req.user = user
        next()
    } catch (error) {
        res.status(400).send("ERROR: "+ error.message)
    }
    
}   

module.exports = { userAuth}