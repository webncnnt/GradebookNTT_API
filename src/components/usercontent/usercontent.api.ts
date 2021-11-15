import { Router } from 'express';
import multer from 'multer';
import userContentController from './usercontent.controller';

const router = Router();
const imageUpload = multer();

router.post(
	'/avatar',
	imageUpload.single('avatar'),
	userContentController.uploadAvatarImage
);

router.post(
	'/classBanner',
	imageUpload.single('classBanner'),
	userContentController.uploadClassBannerImage
);

export default router;
