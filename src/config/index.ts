import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const config = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || 8000,
	DB_HOST: process.env.DB_HOST,
	DB_USERNAME: process.env.DB_USERNAME,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_NAME: process.env.DB_NAME,
	DB_PORT: process.env.DB_PORT ? +process.env.DB_PORT : 5432
};
