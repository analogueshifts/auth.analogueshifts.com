module.exports = {
  apps: [
    {
      name: "auth-frontend",
      cwd: "/var/www/auth.analogueshifts.com",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
    },
  ],
};
