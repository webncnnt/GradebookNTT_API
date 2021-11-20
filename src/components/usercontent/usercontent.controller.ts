import { NextFunction, Request, Response } from 'express';

import { uploadOneMediaFile } from '@components/uploadMediaServices';
import { AppError, IllegalArgumentError } from '@src/utils/appError';
import { HttpStatusCode } from '@src/constant/httpStatusCode';
import { config } from '@src/config';

import K from './usercontent.constant';

const validateImageType = (target: string, validTypes: string[]) => {
	return validTypes.includes(target);
};

export const uploadAvatarImage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.file)
		throw new IllegalArgumentError(
			K.UserContentMessage.FILE_EMPTY_IN_REQUEST_ERROR
		);

	if (!validateImageType(req.file.mimetype, K.VALID_IMAGE_TYPES)) {
		throw new IllegalArgumentError(K.UserContentMessage.INVALID_IMAGE_TYPE);
	}

	const apiRes = await uploadOneMediaFile(
		config.CLOUDINARY_FOLDER_AVATAR,
		req.file
	);

	res.status(HttpStatusCode.OK).json({
		status: 'success',
		data: { url: apiRes.secure_url }
	});
};

export const uploadClassBannerImage = (
	req: Request,
	res: Response,
	next: NextFunction
) => {};

export default { uploadAvatarImage, uploadClassBannerImage };
