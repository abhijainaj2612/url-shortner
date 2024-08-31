const mongoose  = require("mongoose")
require('dotenv').config()

const mongoUri = process.env.MONGO_URI;

const connectToMongo = ()=>{
    mongoose.connect(mongoUri,(err)=>{
        if(!err){

            console.log("Connected To Mongo Successfully");
        }else{
            console.log(err);
        }
    });
}

module.exports = connectToMongo;