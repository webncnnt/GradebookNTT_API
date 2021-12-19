import { deleteDataStudent, findStudentsByClassId, saveStudent } from './student.model';
import { findUserIdByStudentId } from '@src/auth/users.model';
import { saveStudentgrade, updateGradeStudent } from './grade.model';
import { findAssignmentById, findClassNameByClassId, findEmailStudentByClassId } from './student.model';
import { sendEmail } from '../mailServices/mail.service';


export interface IHash {
	[details: number]: string;
}
export const uploadStudent = async (students: any, classId: number) => {
	await deleteDataStudent();
	let hashMap: IHash = {};

	for (var i = 0; i < students.length; i++) {
		const userId: any = await findUserIdByStudentId(students[i].studentId);
		if (userId != null && hashMap[userId] == null) {
			hashMap[userId] = students[i].studentId;
		}
		await saveStudent(
			students[i].studentId,
			students[i].studentName,
			userId,
			classId

		);
	}
    return hashMap;
};

export const inputGrade = async(studentId: string, score: number, assignmentId: number)=>{
	await saveStudentgrade(studentId, score, assignmentId);
}

export const getStudentsByClassId = async(classId: number) =>{
	const result = await findStudentsByClassId(classId)
	return result;
}

export const markFinalizeGrade = async (assignmentId: number) =>{
	 //find class id ->name class -> asigmnent name -> tim student -> email
	 const assignment: any = await findAssignmentById(assignmentId);
	 const className = await findClassNameByClassId(assignment.classId);
	 const title = assignment.title;
	 const emailList: any = await findEmailStudentByClassId(assignment.classId);
	
	 const msg = {
		to: emailList,
		from: { email: 'huynhthinhi206@gmail.com'},
		subject: `Grade for assignment ${title}'s ${className} class`,
		html: `<h3>Got marks for assignment ${title} at ${className} class</h3> <a href = 'abc.com'>
		Click here to view scores</a>`
	};

	if(emailList.length > 0){
		let result = await sendEmail(msg);
	 	return result;
	}
	else{
		console.log("Email list is empty!!");
	
	}
}

export const updateGrade = async(studentId: string, score: number, assignmentId: number)=>{
	
	await updateGradeStudent(studentId, score, assignmentId);
}