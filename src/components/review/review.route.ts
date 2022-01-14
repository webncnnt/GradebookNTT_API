import { findAssignmentById } from './../students/student.model';
import { findUserByStudentId } from './../../auth/users.model';
import { findReviewById } from './../reviewer/reviewer.model';
import { markFinalReview } from './review.controller';
import { getAllOfReviews, gradeReviewDetail } from './review.model';
import express from 'express';
import { createNotification } from '../notification/notification.model';
const reviewRouter = express.Router();

//get all of reviews of a class
reviewRouter.get('/getListOfReviews/:classID', (req, res)=>{

    const classId = parseInt(req.params.classID);
    getAllOfReviews(classId).then((result) => {
      
        res.status(200).json(result);

    }).catch((err) => {

        console.log(err);
        res.status(500).json({
            message: 'internal error server!!'
        })
        
    });
})

// /View grade review details: Student, grade composition,
// current grade, student expectation grade, student explanation
reviewRouter.get('/gradeReviewDetail/:reviewId', (req, res) =>{

    const reviewId  = parseInt(req.params.reviewId);

    gradeReviewDetail(reviewId).then((result) => {
        
        res.status(200).json(result)
    }).catch((err) => {
        
        console.log(err);
        res.status(500).json({
            message: 'interal error server'
        })
        
    });
})

//Mark the final decision for a student review with an updated grade
reviewRouter.post('/markFinalReview/:reviewId',async (req, res) =>{

    const reviewId: number =parseInt(req.params.reviewId);
    const userId: number = req.body.userId; //recieverId
    const finalScore: number = req.body.finalScore;
    const statusTeacher: string = req.body.statusTeacher  //'NEW' | 'REJECTED' | 'APPROVED';

    const review = await findReviewById(reviewId);

    const result = await markFinalReview(reviewId, finalScore, statusTeacher);

        if(result == false){

            res.status(400).json({
                message:  "ReviewId doesn't exist!! or statusTeacher is wrong format!!"
            
            })
        }
        else{

            res.status(200).json({
                message: 'successfully.'
            });
            const studentId = review?.studentId;
            const assignmentId = review?.assignmentId;
            if(studentId != undefined && assignmentId != undefined){
                const user = await findUserByStudentId(studentId);
                const assign: any = await findAssignmentById(assignmentId);
              
                if(user != null && user != undefined && assign != null && assign != undefined){
                    const receiverId = user.id;
                    const title = assign.title;
                    const noftifyMessage = `teacher created a final decision with assignment: ${title}.`;
                    await createNotification(noftifyMessage, userId, receiverId);

                }
                else{
                    res.status(400).json({
                        message: "User hasn't mapped mssv or assigmentId doesn't exist in gradAssignment table!!"
                    });
                }
                
            }
           

        }
   
    

})
export default reviewRouter;