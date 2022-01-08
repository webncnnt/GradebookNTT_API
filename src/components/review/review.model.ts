import { Review } from "@src/models/Review";
import db from "@src/db";

export const getAllOfReviews = async ()=>{
    const strQuery = `select RV."studentId", RV."statusTeacher", RV."statusStudent", 
    RV."expectedScore", RV."message", GA."title", GA."score" as scaleGrade 
    from "review" as RV, "gradeAssignments" as GA 
    where RV."assignmentId" = GA."id"`;

    const result: any = await db.query(strQuery);
    
    if(result == null || result.length == 0)    return result;
    return result[0]
    
}