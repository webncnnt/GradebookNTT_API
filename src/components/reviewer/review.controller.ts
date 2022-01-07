import { gradeDetailOfAStudent } from './reviewer.model';

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

    const gradeDetail = [result, {total: totalScore/totalScale}]
	return gradeDetail;
};
