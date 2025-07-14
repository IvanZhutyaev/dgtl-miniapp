module.exports = {
  apps: [
    {
      name: 'GTLS-server',
	  cwd: './server',
      script: 'index.js',
      watch: false,
    },
    {
      name: 'GTLS-client',
      cwd: './client',
      script: 'npm',
      args: 'start',
      watch: false,
    },
    {
      name: 'GTLS-bot',
	  cwd: './bot',
      script: 'bot.js',
      watch: false,
    },
  ],
};