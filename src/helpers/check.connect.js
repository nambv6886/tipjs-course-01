const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECONDS = 5000;

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log('Number of connection:', numConnection);
}

const checkOverLoad = () => {
  // monitor every 5 secs
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus.length;
    const memoryUsage = process.memoryUsage().rss;
    // example maximum number connections based on number of cores
    const maxConnections = numCores * 2;

    console.log('Active connections: ', numConnection);
    // MB
    console.log('Memory usage in MB: ', memoryUsage / 1024 / 1024);

    if (numConnection > maxConnections) {
      console.log('Connection overload detected');
    }
  }, _SECONDS) 
}

module.exports = {
  countConnect,
  checkOverLoad
}