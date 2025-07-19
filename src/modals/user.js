const mongoose = require('mongoose');
const validators = require('validator');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserShema = new mongoose.Schema({
    firstName:{
        type:String,
        required: [true,'Please provie fisrt name'],
        min: 1,
        max : [50,'name is too long'],
        validate: {
            validator : (value)=>{
                return value.length > 3
            },
            message: ()=> 'username length is too short'
        }
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        trim:true,
        index: true,
        unique:true,
        validate:{
            validator:(value)=>{
               return validators.isEmail(value);
            },
            message: ()=> 'inValid Email'
        }
    },
    password:{
        type:String
    }
});

UserShema.methods.getJWT = async function (){
    const user = this;
    const token  = await jwt.sign({_id:user._id},'harshaGelli007',{expiresIn:'7d'});
    // res.cookie('token',token);
    return token
}

UserShema.methods.decryptedPassword = async function (password){
    const user = this;
    const isValid = await bycrypt.compare(password,user.password);
    return isValid;
}
module.exports = mongoose.model('User',UserShema);