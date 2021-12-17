import { saveStudent } from './student.model';
import { findUserIdByStudentId } from '@src/auth/users.model';

export interface IHash {
	[details: number]: string;
}
export const uploadStudent = async (students: any) => {
	let hashMap: IHash = {};

	for (var i = 0; i < students.length; i++) {
		const userId: any = await findUserIdByStudentId(students[i].studentId);
		if (userId != null && hashMap[userId] == null || hashMap[userId] == undefined) {
			hashMap[userId] = students[i].studentId;
		}
		await saveStudent(
			students[i].studentId,
			students[i].studentName,
			userId
		);
	}
    return hashMap;
};
