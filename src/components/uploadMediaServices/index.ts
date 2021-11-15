import { ImageFormat, UploadApiResponse, VideoFormat } from 'cloudinary';
import cloudinary from '../../imageCloudinary';

export const uploadOneMediaFile = (
	folder: string,
	file: Express.Multer.File
): Promise<UploadApiResponse> => {
	return new Promise((resolve, reject) => {
		const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
			{ folder },
			(err, result) => {
				if (err) reject(err.message);
				if (result) resolve(result);
			}
		);

		cloudinaryUploadStream.end(file.buffer);
	});
};
