const mongoose = require('mongoose');

const dbConnect = async ()=>{
       await mongoose.connect('mongodb+srv://hgelli214:Harsha214@nodejs.eiwxhrg.mongodb.net/tinderDB?retryWrites=true&w=majority&appName=NodeJS');
}

module.exports = dbConnect;