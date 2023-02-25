const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const connectDB = async()=>{
    return await mongoose.connect(process.env.BDURI).
    then( res=>{
        console.log("connected DB");
    }).catch(err=>{
        console.log(`fail to connect DB ${err}`);
    });
    
}

module.exports={connectDB};