import { StudentGrade } from "@src/models/StudentGrade";

export const saveStudentgrade = (studentId: string, score: number, assignmentId: number) =>{
    StudentGrade.create({
        studentId: studentId,
        score: score,
        gradeAssignmentId: assignmentId
    })
}