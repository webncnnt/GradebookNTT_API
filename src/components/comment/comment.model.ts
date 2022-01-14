
import { CommentReview } from "@src/models/CommentReview";
import db from "@src/db";

export const createComment = async (reviewId: number, message: string, commenterId: number) =>{

   await CommentReview.create({
        reviewId: reviewId, 
        message: message, 
        commenterId: commenterId
    })
}

export const getAllCommentByReviewId = async (reviewId: number) =>{

    const strQuery = `select RV."message", U."fullname" as commenterName, U."avatar" from "commentReview" as RV, "Users" as U
                        where RV."commenterId" = U.id and RV."reviewId" = ${reviewId}`;

    const result = await db.query(strQuery)

    return result[0];
}