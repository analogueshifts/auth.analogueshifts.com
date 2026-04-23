module.exports = {
  apps: [
    {
      name: "auth-frontend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: process.env.NODE_ENV || "production",
        PORT: process.env.PORT || 3000,
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
    },
  ],
};
