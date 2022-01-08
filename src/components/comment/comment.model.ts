import { CommentReview } from "@src/models/CommentReview";

export const createComment = async (reviewId: number, message: string, commenterId: number) =>{

   await CommentReview.create({
        reviewId: reviewId, 
        message: message, 
        commenterId: commenterId
    })
}