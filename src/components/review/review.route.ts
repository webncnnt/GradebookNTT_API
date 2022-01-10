import { markFinalReview } from './review.controller';
import { getAllOfReviews, gradeReviewDetail } from './review.model';
import express from 'express';
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
reviewRouter.post('/markFinalReview/:reviewId', (req, res) =>{

    const reviewId: number =parseInt(req.params.reviewId);
    const finalScore: number = req.body.finalScore;
    const statusTeacher: string = req.body.statusTeacher  //'NEW' | 'REJECTED' | 'APPROVED';

    markFinalReview(reviewId, finalScore, statusTeacher).then((result) => {
        if(result == false){

            res.status(400).json({
                message:  "ReviewId doesn't exist!! or statusTeacher is wrong format!!"
            
            })
        }
        else{

            res.status(200).json({
                message: 'successfully.'
            })
        }
    }).catch((err) => {
        
        res.status(500).json({
            message: 'internal error server!!'
        })
    });
    

})
export default reviewRouter;