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

const validateProfileEdit = (req) =>{
    const editableFields = [
        "firstName",
        "lastName",
        "gender",
        "age",
        "skills",
        "photoUrl",
        "about"
    ]

    const isEditAllowed = Object.keys(req.body).every((item)=>{
        return editableFields.includes(item)
    })
    return isEditAllowed
}
const validatePassword = (password) =>{
    if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password")
    }
}

module.exports = {
    validateSignupBody,
    validateProfileEdit,
    validatePassword
}