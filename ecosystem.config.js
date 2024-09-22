module.exports = {
  apps: [
    {
      name: "server",
      script: "nodemon server.js",
      // Add any other options you need for server.js
    },
    {
      name: "peer",
      script: "peerjs",
      args: "--port 3001",
      exec_mode: "fork", // Use fork mode to run a single instance
      interpreter: "none", // This is important for direct command execution
    },
  ],
};
