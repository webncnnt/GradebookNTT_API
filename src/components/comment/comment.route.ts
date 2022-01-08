import { addComment } from './comment.controller';
import express from 'express';
import { getAllCommentByReviewId } from './comment.model';
const commentRouter = express.Router();

//teacher and student create comment
commentRouter.post('/addComment', (req, res) =>{
    const reviewId: number = req.body.reviewId;
    const message: string = req.body.message;
    const commenterId: number = req.body.commenterId;

    addComment(reviewId, message, commenterId).then((result) => {
        if(!result)    res.status(400).json({
            message: `reviewId or commenterId doesn't exist!`
        })
        else{
            res.status(200).json(result);
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: 'internal error server!'
        })
        
    });


})

//View comments on grade review between the teacher and himself
commentRouter.get('/getAllCommentByReviewId/:reviewId', (req, res)=>{

    const reviewId = req.params.reviewId;
    getAllCommentByReviewId(parseInt(reviewId)).then((result) => {

        res.status(200).json(result)
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: 'internal error server!'
    });
})

})


export default commentRouter;