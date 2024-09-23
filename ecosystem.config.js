module.exports = {
  apps: [
    {
      name: "server",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000, // Use Render's PORT env var
      },
    },
    {
      name: "peer",
      script: "peerjs",
      args: `--port ${process.env.PORT || 3001} --key peerjs`, // Bind PeerJS to the same port
      exec_mode: "fork",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
