module.exports = {
	apps: [
		{
			name: 'gradebook-api',
			script: 'ts-node -r tsconfig-paths/register src/server.ts',
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
};
