'use strict';

const { Schema, model } = require('mongoose');

const COLLECTION_NAME = 'ApiKeys';
const DOCUMENT_NAME = 'ApiKey';

const apiKeySChema = new Schema(
  {
    key: { type: String, require: true, unique: true },
    status: { type: Boolean, default: true },
    permissions: {
      type: [String],
      enum: ['0000', '1111', '2222'],
      require: true,
    },
    createdAt: { type: Date, default: Date.now, expires: '30d' },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = model(DOCUMENT_NAME, apiKeySChema);
