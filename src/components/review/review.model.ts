import { Review } from "@src/models/Review";
import db from "@src/db";

export const getAllOfReviews = async ()=>{
    const strQuery = `select RV.id, RV."studentId", RV."statusTeacher", RV."statusStudent", 
    RV."expectedScore", RV."message", GA."title", GA."score" as scaleGrade 
    from "review" as RV, "gradeAssignments" as GA 
    where RV."assignmentId" = GA."id"`;

    const result: any = await db.query(strQuery);
    
    if(result == null || result.length == 0)    return result;
    return result[0]
    
}

export const gradeReviewDetail = async (reviewId: number) =>{

    const strQuery = `select RV.id, RV."studentId", RV."statusTeacher", RV."statusStudent", 
    SG."score" as currentScore, RV."expectedScore", RV."message", GA."title", GA."score" as scaleGrade 
    from "review" as RV, "gradeAssignments" as GA, "StudentGrades" as SG 
    where RV.id = ${reviewId} and RV."assignmentId" = GA."id" and RV."studentId" = SG."studentId" 
    and RV."assignmentId" = SG."id"`

    const result:any = await db.query(strQuery);

    if(result == null || result.length == 0)   return result;
    
    return result[0];
}