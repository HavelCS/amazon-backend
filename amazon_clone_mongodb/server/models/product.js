const mongoose = require("mongoose");
const ratingSchema = require("../models/rating");
const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    images: [
        {
            type: String,
            required: true
            
        }
    ],
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,

    },
    ratings: [ratingSchema]
});

const Product = mongoose.model("Product",ProductSchema);

module.exports = {Product, ProductSchema};