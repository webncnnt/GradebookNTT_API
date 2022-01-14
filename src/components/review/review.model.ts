import { Review } from "@src/models/Review";
import db from "@src/db";

//View list of grade reviews requested by students
export const getAllOfReviews = async (classId: number)=>{
    const strQuery = `select RV.id as reviewId, RV."studentId", RV."statusTeacher", RV."statusStudent", 
    RV."expectedScore", RV."message", GA."title", GA."score" as scaleGrade 
    from "review" as RV, "gradeAssignments" as GA
    where GA."classId" = ${classId} and RV."assignmentId" = GA."id"`;

    const result: any = await db.query(strQuery);
    
    if(result == null || result.length == 0)    return result;
    return result[0]
    
}

//View grade review details: Student, grade composition,
// current grade, student expectation grade, student explanation
export const gradeReviewDetail = async (reviewId: number) =>{

    const strQuery = `select RV.id as reviewId, RV."studentId", RV."statusTeacher", RV."statusStudent", 
    SG."score" as currentScore, RV."expectedScore", RV."message", GA."title", GA."score" as scaleGrade 
    from "review" as RV, "gradeAssignments" as GA, "StudentGrades" as SG 
    where RV.id = ${reviewId} and RV."assignmentId" = GA."id" and RV."studentId" = SG."studentId" 
    and RV."assignmentId" = SG."gradeAssignmentId"`

    const result:any = await db.query(strQuery);

    if(result == null || result.length == 0)   return result;
    
    return result[0];
}

export const findReviewByReviewId = async(reveiwId: number) =>{


    const review :any = await Review.findOne({
        where: {
            id: reveiwId
        },
    })
    
   return review;
}

