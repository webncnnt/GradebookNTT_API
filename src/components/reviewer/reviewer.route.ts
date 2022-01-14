import {
    createNotification,
	findIdTeachersByClassId,
	findOwnerOfClassId
} from './../notification/notification.model';

import { findAssignmentById } from './../students/student.model';
import {
	findFullNameByStudentId,
	findUserByStudentId
} from './../../auth/users.model';
import { addReview, findReviewByStudentIdAndAssignmentId } from './reviewer.model';
import { createReview } from './review.controller';
import { gradeDetail } from './review.controller';
import express from 'express';
const reviewer = express.Router();

//View his grade compositions, overall grade
reviewer.get('/gradeDetail/:studentId', (req, res) => {
	const studentId = req.params.studentId;
	gradeDetail(studentId)
		.then(result => {
			if (result == null)
				res.status(400).json({
					message: "Mssv doesn't exist!!"
				});
			else res.status(200).json(result);
		})
		.catch(err => {
			console.log('error at grade detail');
		});
});

//Request a review of each grade composition
reviewer.post('/requestReview', async (req, res) => {
	//studentId: string, assignmentId: number, expectedScore: number, message: string
	const studentId = req.body.studentId;
	const assignmentId = req.body.assignmentId;
	const expectedScore = req.body.expectedScore;
	const message = req.body.message;

	const result = await addReview(studentId, assignmentId, expectedScore, message);
	    if(result == false)  res.status(400).json({message: `StudentGrade doesn't exist`});
	    else{
            const review = await findReviewByStudentIdAndAssignmentId(studentId, assignmentId)
	        res.status(200).json(review);

            //send notification
            //condition: class gradeAssignment must have classId != null
            //class Class must have ownerId != null
            const user: any = await findUserByStudentId(studentId);
            if (user != null && user != undefined) {
                const fullname = user.fullname;
                const assign = await findAssignmentById(assignmentId);
                if (assign != null && assign != undefined) {
                    const title = assign?.title;
                    const notifyMessage = `${user.fullname} requested review grade with assignment: ${title}.`;
        
                    //tim ds gv cua class
                    const classId = assign.classId;
                    const Ids: any = await findIdTeachersByClassId(classId);
                    const ownerId: any = await findOwnerOfClassId(classId);
        
                    if (ownerId != null && ownerId != undefined) {
                        Ids.push(ownerId);
                        console.log(Ids);

                        //create notification to teachers
                        for(let i = 0; i < Ids.length; i++){
                            await createNotification(notifyMessage, user.id, Ids[i]);
                        }

                    } else {
                        console.log("classId or ownerId of class doesn't exist !!");
                        
                    }
                } else {
                   console.log( "AssignmentId doesn't exist!!");
                   
                }
            } else {
                console.log("User hasn't mapped mssv!!");
            }
        }

});

export default reviewer;
