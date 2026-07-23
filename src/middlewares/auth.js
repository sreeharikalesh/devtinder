const jwt = require('jsonwebtoken');
const UserModel = require("../models/user")
const userAuth = async (req, res, next)=>{

    try {
        const { token } = req.cookies

        console.log(token);
        if(!token){
            throw new Error("invalid token");
        }

        const decodedObj = jwt.verify(token, 'da9ea8e99224c1d401032776fe881a0523444b1bc9fcda8b1a6ba4467c942089dbb22b74035b16b6453b40cf6f2bd77b')
        console.log(decodedObj);

        let {_id} = decodedObj;
        
        let user = await UserModel.findById({_id})

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