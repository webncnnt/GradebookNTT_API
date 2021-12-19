import { uploadStudent, inputGrade, getStudentsByClassId, markFinalizeGrade, updateGrade } from './student.controller';
import express from 'express';
import { ResponseError } from '@sendgrid/mail';


const studentRouter = express.Router();

studentRouter.post('/uploadStudents', (req, res, next)=>{
    const students = req.body.students;
    const classId = req.body.classId;
   
    uploadStudent(students, classId).then((result) => {
        res.status(200).json({
            message: "Upload successfully.",
            mappedStudents: result
        })
    }).catch((err) => {
        console.log("Upload students not successfully!");
        console.log(err);
        
        res.status(400).json({
            message: "Bad request."
        })
    });
})

studentRouter.post('/inputGrade', (req,res,next)=>{
    const studentId = req.body.studentId;
    const score = req.body.score;
    const assignmentId = req.body.assignmentId;
    inputGrade(studentId, parseFloat(score), assignmentId).then((result) => {
        res.status(200).json({
            message: "Input grade successfully"
        })
    }).catch((err) => {
        res.status(500).json({
            message:  "Error internal server!"
        })
    });
})

studentRouter.put('/updateGrade', (req,res,next)=>{
    const studentId = req.body.studentId;
    const score = req.body.score;
    const assignmentId = req.body.assignmentId;
    updateGrade(studentId, score, assignmentId).then((result) => {
        res.status(200).json({
            message: "Update grade successfully"
        })
    }).catch((err) => {
        res.status(500).json({
            message:  "Error internal server!"
        })
    });
})

studentRouter.get('/markFinalizedGrade/:assignmentId', (req, res, next)=>{
    const assignmentId = req.params.assignmentId;
    markFinalizeGrade(parseInt(assignmentId)).then((result) => {
        res.status(200).json({
            message: "successfully."
        })
    }).catch((err) => {
        console.log(err);
        
        res.status(500).json({
            message: "Internal server error!"
        })
    });
  
   
})

studentRouter.get('/getStudentsByClassId/:classId', (req, res, next)=>{
    const classId = req.params.classId;
    getStudentsByClassId(parseInt(classId)).then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: "internal server error."
        })
    });
})
export default studentRouter;