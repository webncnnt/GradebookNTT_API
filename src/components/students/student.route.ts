import { uploadStudent, inputGrade } from './student.controller';
import express from 'express';
import { ResponseError } from '@sendgrid/mail';
const studentRouter = express.Router();

studentRouter.post('/uploadStudents', (req, res, next)=>{
    const students = req.body.students;
   
    uploadStudent(students).then((result) => {
        res.status(200).json({
            message: "Upload successfully.",
            mappedStudents: result
        })
    }).catch((err) => {
        console.log("Upload students not successfully!");
        res.status(400).json({
            message: "Bad request."
        })
    });
})

studentRouter.post('/inputGrade', (req,res,next)=>{
    const studentId = req.body.studentId;
    const score = req.body.score;
    const assignmentId = req.body.assignmentId;
    inputGrade(studentId, score, assignmentId).then((result) => {
        res.status(200).json({
            message: "input grade successfully"
        })
    }).catch((err) => {
        res.status(500).json({
            message:  "Error internal server!"
        })
    });
    
})
export default studentRouter;