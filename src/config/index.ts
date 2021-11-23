import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const config = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || 8000,
	DB_HOST: process.env.DB_HOST,
	DB_USERNAME: process.env.DB_USERNAME,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_NAME: process.env.DB_NAME,
	DB_PORT: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
	CLOUDINARY_FOLDER_AVATAR: process.env.CLOUDINARY_FOLDER_AVATAR!,
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
	SENDGRID_API_KEY: process.env.SENDGRID_API_KEY!,
	DOMAIN: process.env.DOMAIN!,
	CLIENT_ID: process.env.CLIENT_ID!
};
