import { gradeDetailOfAStudent } from './reviewer.model';
import { addReview } from './reviewer.model';

export const gradeDetail = async (studentId: string) => {
	const result: any = await gradeDetailOfAStudent(studentId);
	if (result == null) return result;

	let totalScore = 0;
	let totalScale = 0;
	for (var i = 0; i < result.length; i++) {

		const score = result[i].score;
		const scaleGrade = parseInt(result[i].scalegrade);
		totalScore += score * scaleGrade;
        totalScale += scaleGrade
	}

	if(result.length == 0)	return null;
    const gradeDetail = [result, {total: totalScore/totalScale}]
	return gradeDetail;
};

export const createReview = async (studentId: string, assignmentId: number, expectedScore: number, message: string) =>{

    const result: any = await addReview(studentId, assignmentId, expectedScore, message);
    return result;
}