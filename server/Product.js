const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name:String,
    type:String,
    weight:String,
    fuction:String,
    price:String,
    benefits:String
})


mongoose.model("product",ProductSchema)