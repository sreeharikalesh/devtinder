const validator = require('validator');

const validateSignupBody =(req)=>{
    let {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("name is empty")
    }
    else if(!validator.isEmail(email)){
        throw new Error("please enter a valid email address")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password")
    }
}

module.exports ={
    validateSignupBody
}