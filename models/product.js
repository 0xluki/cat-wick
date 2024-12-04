const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    photo:{
        type: String
    },
    describtion:{
        type: String 
    }
});

module.exports = mongoose.model("Product", productSchema)