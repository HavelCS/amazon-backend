const mongoose = require("mongoose");
const { ProductSchema } = require("./product");


const UserSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },

  password: {
    trim: true,
    required: true,
  },

  name: {
    type: String,
    trim: true,
    required: true
  },

  address: {
    type: String,
    default: ""
  },

  type: {
    type: String,
    default: "user"
  },

  cart: [
    {
      product: ProductSchema,
      quantity: {
        type: Number,
        required: true
      }
    }
  ]



});

const User = mongoose.model("User", UserSchema);

module.exports = User;