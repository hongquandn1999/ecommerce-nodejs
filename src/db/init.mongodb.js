'use strict';
const mongoose = require('mongoose');
class Database {
  constructor() {
    this.connect();
  }

  connect() {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    mongoose
      .connect(
        `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_USER_PASSWORD}@cluster0.v2jtx.mongodb.net/?retryWrites=true&w=majority`
      )
      .then(() => {
        console.log('MongoDB connected...');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

module.exports = Database.getInstance();
