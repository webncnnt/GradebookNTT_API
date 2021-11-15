const VALID_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

class UserContentMessage {
	static readonly FILE_EMPTY_IN_REQUEST_ERROR =
		'Cannot find any file in request';
	static readonly INVALID_IMAGE_TYPE = 'Invalid image type';
}

export default { VALID_IMAGE_TYPES, UserContentMessage };
