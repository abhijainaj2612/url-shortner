const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    shortcode:{
        type:String,
        requires:true,
        unique :true
    },
    date:{
        type: Date,
        default:Date.now
    },

});

module.exports = mongoose.model('url',urlSchema);