const jwt = require('jsonwebtoken');
const User = require('../modals/user'); 
const isAutherized = async (req,res,next)=>{
    try{
    const {token} = req.cookies;
    const decodedId = await jwt.verify(token,'harshaGelli007');
    if(!decodedId){
        return res.status(401).send('unauthorized');
    }
    const userId = User.findById(decodedId._id)
    if(!userId){
        return res.status(401).send('unauthorized');
    }
    req.user = userId;
    next();
  }catch(err){
    console.log(err);
    res.status(401).send('unauthorized');
  }

}

module.exports = {isAutherized}