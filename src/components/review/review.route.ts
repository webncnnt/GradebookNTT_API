import { getAllOfReviews, gradeReviewDetail } from './review.model';
import express from 'express';
const reviewRouter = express.Router();

reviewRouter.get('/getListOfReviews', (req, res)=>{

    getAllOfReviews().then((result) => {
      
        res.status(200).json(result);

    }).catch((err) => {

        console.log(err);
        res.status(500).json({
            message: 'internal error server!!'
        })
        
    });
})

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
export default reviewRouter;