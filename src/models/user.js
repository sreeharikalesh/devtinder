const mongoose = require('mongoose');
var validator = require('validator');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required : true,
        minLength: 3,
        maxLength: 50,
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter a valid email address")
            }
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("please enter a strong password")
            }
        }
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender data is not valid")
            }
        }
    },
    age:{
        type: Number,
        min: 18,
        maxLength: 2

    },
    skills:{
        type:[String],
        validate(value){
            if(value.length > 10){
                throw new Error("skills cannot be more than 10")
            }
        }
    },
    photoUrl:{
        type: String,
        default: "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("please enter a valid url")
            }
        }
    }
    
},
{
    timestamps:true
}
)

const User = mongoose.model('User', userSchema);

module.exports = User  