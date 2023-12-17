'use strict';

const mongoose = require('mongoose');
const process = require('process');
const os = require('os');

const _SECONDS = 2000;

const countConnect = () => {
  const numConnection = mongoose.connections.length;

  console.log(`Number of connections: ${numConnection}`);
};

// Check overload connection
const checkOverloadConnect = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCors = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum connection: 10

    const maxConnection = numCors * 5;

    if (numConnection > maxConnection) {
      console.log('Overload connection');
      console.log(`Number of connections: ${numConnection}`);
      console.log(`Number of cors: ${numCors}`);
      console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
      console.log(`Maximum connection: ${maxConnection}`);
      console.log('----------------------------------------');
    }
  }, _SECONDS);
};

module.exports = { countConnect, checkOverloadConnect };
