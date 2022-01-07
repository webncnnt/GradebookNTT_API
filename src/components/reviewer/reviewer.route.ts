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

export default reviewer;
