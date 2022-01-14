import { createNotification, findIdTeachersByClassId, findOwnerOfClassId } from './../notification/notification.model';
import {
	findAssignmentById,
	findStudentByStudentId,
	findStudentByUserId
} from './../students/student.model';
import { findUserById, findUserByStudentId } from './../../auth/users.model';
import { findReviewById } from './../reviewer/reviewer.model';
import { addComment } from './comment.controller';
import express from 'express';
import { getAllCommentByReviewId, createComment } from './comment.model';
const commentRouter = express.Router();

//teacher and student create comment
commentRouter.post('/addComment', async (req, res) => {
	const reviewId: number = req.body.reviewId;
	const message: string = req.body.message;
	const commenterId: number = req.body.commenterId;

	// const result = await addComment(reviewId, message, commenterId);
    const result = true;
	if (!result)
		res.status(400).json({
			message: `reviewId or commenterId doesn't exist!`
		});
	else {
		res.status(200).json(result);
		const review = await findReviewById(reviewId);
		const studentId = review?.studentId;
		const assignmentId = review?.assignmentId;
		if (studentId != undefined && assignmentId != undefined) {
			const user = await findUserByStudentId(studentId);
			const assign: any = await findAssignmentById(assignmentId);

			if (
				user != null &&
				user != undefined &&
				assign != null &&
				assign != undefined
			) {
				const receiverId = user.id;
				const title = assign.title;
				const noftifyMessage = `${user.fullname} replies to assignment: ${title}.`;
				const student = await findStudentByUserId(commenterId);
				//kt commenterId la gv -> receiver la sv
				//commenterId la sv --> receiver la list gv
				if (student == null || student == undefined) {
					await createNotification(
						noftifyMessage,
						commenterId,
						receiverId
					);
				} else {
					const classId = assign.classId;
					const Ids: any = await findIdTeachersByClassId(classId);
					const ownerId: any = await findOwnerOfClassId(classId);

					if (ownerId != null && ownerId != undefined) {
						Ids.push(ownerId);
						console.log(Ids);

						//create notification to teachers
						for (let i = 0; i < Ids.length; i++) {
							await createNotification(
								noftifyMessage,
								commenterId,
								Ids[i]
							);
						}
					} else {
						console.log("classId or ownerId of class doesn't exist !!");
                        
					}
				}

			} else {
				console.log("User hasn't mapped mssv or assigmentId doesn't exist in gradAssignment table!!");

			}
		}
	}
});

//View comments on grade review between the teacher and himself
commentRouter.get('/getAllCommentByReviewId/:reviewId', (req, res) => {
	const reviewId = req.params.reviewId;
	getAllCommentByReviewId(parseInt(reviewId))
		.then(result => {
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: 'internal error server!'
			});
		});
});

export default commentRouter;
