const express = require('express');
const  profileRouter = express.Router();
const {isAutherized} = require('../middlewares/auth');
const bycrypt = require('bcrypt');


profileRouter.get('/profile',isAutherized,async (req,res)=>{
    try{
     res.status(200).json({...req.user._doc})
    }catch(err){
        return res.status(500).send('Error: '+err.message);
    }
});

profileRouter.post('/updateProfile',isAutherized,async (req,res)=>{
  try{
    const loggedinUser = req.user;
    if(req.body.password){
      req.body.password = await bycrypt.hash(req.body.password,10);
     }
     Object.keys(req.body).forEach((key)=>{
      if(key !== '_id' && key !== 'emailId'){
        loggedinUser[key] = req.body[key];
            console.log(loggedinUser[key],' logged user updated')
      }
    });
   console.log('Modified fields:', loggedinUser.modifiedPaths());
    await loggedinUser.save();
    res.status(200).send('profile updated successfully');
  }catch(err){
    res.status(400).send('Error: '+err.message);
  }
});

profileRouter.get('/getUser',isAutherized,async (req,res)=>{
  try{
    res.status(200).json(req.user)
  }catch(err){
    res.status(500).send('Error: '+err.message);
  }
})

module.exports = profileRouter;