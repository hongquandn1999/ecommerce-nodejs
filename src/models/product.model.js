'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: String,
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronic', 'Clothing', 'Furniture', 'Food', 'Girl'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// define product type = clothing

const clothingSchema = new Schema(
  {
    brand: String,
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: 'Clothes',
  }
);

// define product type = electronic

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: 'Electronics',
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model('Clothing', clothingSchema),
  electronic: model('Electronic', electronicSchema),
};
