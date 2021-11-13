export class ClassesMessageError {
	static readonly INVALID_CLASS_ID = 'Deleted or invalid class ID';
	static readonly CLASS_NOT_EXISTS = 'Class does not exist';
	static readonly NOT_ENOUGH_INFORMATION_CREATE_CLASS =
		'Information is not enough to create class';
	static readonly NOT_ENOUGH_INFORMATION_UPDATE_CLASS =
		'Invalid information in one or more fields. check your class information';
}

export class ClassesMessageSuccess {
	static readonly SUCCESS_CREATE_CLASS = 'Class is created successfully';
	static readonly SUCCESS_UPDATE_CLASS = 'Class is updated successfully';
	static readonly SUCCESS_DELETE_CLASS = 'Class is deleted successfully';
}
