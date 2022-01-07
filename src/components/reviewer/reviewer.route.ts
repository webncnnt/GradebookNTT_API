import { addReview } from './reviewer.model';
import { createReview } from './review.controller';
import { gradeDetail } from './review.controller';
import express from 'express';
const reviewer = express.Router();


reviewer.get('/gradeDetail/:studentId', (req, res) => {
	const studentId = req.params.studentId;
	gradeDetail(studentId)
		.then(result => {
            if(result == null)
                res.status(400).json({
                    message: "Mssv doesn't exist!!"
                })
            else
			    res.status(200).json(result);
		})
		.catch(err => {
			console.log('error at grade detail');
		});
});

reviewer.post('/requestReview', (req, res)=>{
    //studentId: string, assignmentId: number, expectedScore: number, message: string
    const studentId = req.body.studentId;
    const assignmentId = req.body.assignmentId;
    const expectedScore = req.body.message;
    const message = req.body.message;

    addReview(studentId, assignmentId, expectedScore, message).then((result) => {
        if(result == false)  res.status(400).json({message: `StudentGrade doesn't exist`});
        else
            res.status(200).json({
                message: 'Request review successfully'
            });
    }).catch((err) => {
        console.log(err);
        
        res.status(500).json({message: "internal error"});
    });

})
export default reviewer;
