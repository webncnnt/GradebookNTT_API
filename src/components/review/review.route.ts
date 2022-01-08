import { getAllOfReviews } from './review.model';
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

export default reviewRouter;