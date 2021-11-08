module.exports = {
	apps: [
		{
			name: 'gradebook-api',
			script: 'npm run start',
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
};
