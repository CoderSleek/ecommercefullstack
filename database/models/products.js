const mongoose = require('mongoose');

const {Schema} = mongoose;

productSchema = {
  id: Number,
  title: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  rating: {
    type: Object,
    default: {}
  },
  stock: Number
};

const ProductModel = new mongoose.model('products', productSchema);
module.exports = ProductModel;
