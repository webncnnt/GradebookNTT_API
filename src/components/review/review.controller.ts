import {
	findGradeStudentByStudentIdAndAssignId,
	updateGradeStudent
} from './../students/grade.model';
import { findReviewById } from './../reviewer/reviewer.model';

export const markFinalReview = async (reviewId: number, finalScore: number, statusTeacher: string) => {
	const review: any = await findReviewById(reviewId);
	if (review != null) {
		const studentId = review.studentId;
		const assignmentId = review.assignmentId;
      
       statusTeacher = statusTeacher.toUpperCase();
       
       if(statusTeacher.localeCompare("ACCEPTED") != 0 && statusTeacher.localeCompare("REJECTED") != 0) return false;

       else{
        await updateGradeStudent(studentId, finalScore, assignmentId);
        review.update({
            statusTeacher: statusTeacher.toUpperCase(),
            statusStudent: "REVIEWED"
        })
 
        const updatedReview = await findReviewById(reviewId);
        return updatedReview;
       }
      

	}

	return false;
	
};
