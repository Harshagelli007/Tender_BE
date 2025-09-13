const express = require('express');
const authRouter = express.Router();
const User = require('../modals/user');
const {validateSignUpData} = require('../utils/Validation');
const bycrypt = require('bcrypt');


authRouter.post('/signup',async (req,res)=>{
  try{
    validateSignUpData(req.body);
    const userExists = await User.findOne({emailId: req.body.emailId});
    if(userExists){
      throw new Error('User already Exists with this email ID')
    }
    const {firstName,lastName,emailId,password,photoUrl,age,discription} = req.body;
    const encryptedPassword = await bycrypt.hash(password,10);
    const user = new User({firstName,lastName,emailId,password:encryptedPassword,photoUrl,age,discription});
    await user.save();
    res.status(200).send(`Welcome ${req.body.firstName} ${req.body.lastName} you have been registerd succesfully`);
  }catch(err){
    res.status(400).send("Error: "+ err.message)
  }
});

authRouter.post('/login',async (req,res)=>{
  try{
    const {emailId,password} = req.body;

    if(!emailId || !password){
      throw new Error('please provide required feilds');
    }
    const user = await User.findOne({emailId});
    if(!user){
      throw new Error('Invalid credentials');
    }
    if(user.decryptedPassword(password)){
      const token = await user.getJWT();
      res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000 });
      res.status(200).json(user);
    }else{
      throw new Error('Invalid credentials');
    }
  }catch(err){
    res.status(400).send(err.message);
  }
});

authRouter.get('/logout', async (req,res)=>{
  try{
    res.cookie('token','',{maxAge:0});
    res.status(200).send('user logged out succesfully');
  }catch(err){
    res.status(500).send('internal Server Error: '+err.message);
  }
});

module.exports = authRouter;

