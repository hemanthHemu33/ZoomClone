module.exports = {
  apps: [
    {
      name: "server",
      script: "server.js",
      instances: 1, // Ensures that a single instance runs (change to 'max' for multi-core scaling)
      autorestart: true, // Restarts automatically if the app crashes
      watch: false, // Turn off file watching in production
      max_memory_restart: "300M", // Restarts the app if it uses too much memory
      env: {
        NODE_ENV: "production", // Set the environment to production
        PORT: 3000, // Default port for your Node.js server
      },
    },
    {
      name: "peer",
      script: "peerjs",
      args: "--port 3001", // Specify the PeerJS server port
      exec_mode: "fork", // Use fork mode to run a single instance
      interpreter: "none", // Direct command execution without Node.js interpreter
      autorestart: true, // Restart automatically if PeerJS crashes
      watch: false, // Disable watching in production
      env: {
        NODE_ENV: "production", // Set environment to production for PeerJS
      },
    },
  ],
};
