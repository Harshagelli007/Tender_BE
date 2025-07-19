const validator = require('validator');

const validateSignUpData = (req)=>{
    const {firstName,emailId,password} = req;
    if(!firstName || !emailId || !password){
        throw new Error("please provide required information");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email id is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error('Password is not strong,Please provide strong password');
    }
}

module.exports = {
    validateSignUpData
}