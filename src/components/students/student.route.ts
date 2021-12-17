import { uploadStudent } from './student.controller';
import express from 'express';
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

export default studentRouter;