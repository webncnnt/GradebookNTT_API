import { findReviewById } from './../reviewer/reviewer.model';
import { findUserById } from './../../auth/users.model';
import { createComment, getAllCommentByReviewId } from './comment.model';

export const addComment = async (
	reviewId: number,
	message: string,
	commenterId: number
) => {
    const review = await findReviewById(reviewId);
    if(review == null || review == undefined){
        return false;
    }
    const user = await findUserById(commenterId);
    if(user == null || user == undefined){
        return false;
    }

    await createComment(reviewId, message, commenterId);
    const comments = await getAllCommentByReviewId(reviewId);
    return comments;
    // return {
    //     message: 'Successfully'
    // }

};
