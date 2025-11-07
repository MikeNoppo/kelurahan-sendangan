module.exports = {
  apps: [
    {
      name: "fe-kelurahansendangan",
      cwd: "./",
      script: "npm",
      args: "start",
      max_memory_restart: "512M",
      max_restarts: 10,
      env: {
        PORT: 13214,
        NODE_ENV: "production",
      },
    },
  ],
};
