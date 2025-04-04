const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  internalReference: { type: String, required: true },
  shellId: { type: Number, required: true },
  inventoryStatus: {
    type: String,
    enum: ['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'],
    default: 'INSTOCK'
  },
  rating: { type: Number, default: 0 },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema); 