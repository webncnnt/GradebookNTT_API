export class ClassesMessageError {
	static readonly INVALID_CLASS_ID = 'Deleted or invalid class ID';
	static readonly CLASS_NOT_EXISTS = 'Class does not exist';
	static readonly CLASS_NOT_EXISTS_WITH_INVITE_CODE = 'Class does not exist';
	static readonly NOT_ENOUGH_INFORMATION_CREATE_CLASS =
		'Information is not enough to create class';
	static readonly NOT_ENOUGH_INFORMATION_UPDATE_CLASS =
		'Invalid information in one or more fields. check your class information';
	static readonly NOT_ENOUGH_INFORMATION_UPDATE_MEMBER_CLASS =
		'Invalid information, check members id';
}

export class ClassesMessageSuccess {
	static readonly SUCCESS_CREATE_CLASS = 'Class is created successfully';
	static readonly SUCCESS_UPDATE_CLASS = 'Class is updated successfully';
	static readonly SUCCESS_DELETE_CLASS = 'Class is deleted successfully';
}

export const USER_CLASS_PER_PAGE = 6;
