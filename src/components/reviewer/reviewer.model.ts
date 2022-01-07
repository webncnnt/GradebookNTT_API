import { StudentGrade } from "@src/models/StudentGrade";
import db from "@src/db";

export const gradeDetailOfAStudent = async(studentId: string) =>{
    const query = `select  GA.score as scaleGrade, SG.score, GA.title from "StudentGrades" as SG, "gradeAssignments" as GA where SG."gradeAssignmentId" = GA."id" and SG."studentId" = '${studentId}'`
    const result = await db.query(query);

   if(result != null)
      return result[0];
    return result;
}