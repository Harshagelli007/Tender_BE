const jwt = require('jsonwebtoken');
const User = require('../modals/user'); 
const isAutherized = async (req,res,next)=>{
    try{
    const {token} = req.cookies;
    if(!token){
      res.status(401).send('unautharized request login again');
      return;
    }
    const decodedId = await jwt.verify(token,'harshaGelli007');
    if(!decodedId){
        return res.status(401).send('unauthorized');
    }
    const userData = await User.findById(decodedId._id)
    if(!userData){
        return res.status(401).send('unauthorized');
    }
    req.user = userData
    next();
  }catch(err){
    console.log(err);
    res.status(401).send('unauthorized');
  }

}

module.exports = {isAutherized}