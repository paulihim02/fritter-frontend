import type { HydratedDocument } from "mongoose";
import moment from "moment";
import { PopulatedComment } from "./model";
// import type { Freet, PopulatedComment } from "../freet/model";

// Update this if you add a property to the Freet type!
type CommentResponse = {
  _id: string;
  commentedOn: string;
  author: string;
  content: string;
  timeStamp: string;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string =>
  moment(date).format("MMMM Do YYYY, h:mm:ss a");

/**
 *
 * @param {HydratedDocument<PopulatedComment>} comment - A comment
 * @returns {CommentResponse} - The comment object formatted for the frontend
 */
const constructCommentResponse = (
  comment: HydratedDocument<PopulatedComment>
): CommentResponse => {
  const commentCopy: PopulatedComment = {
    ...comment.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  const { authorId, freetItemId, commentItemId } = commentCopy;
  delete commentCopy.authorId;
  delete commentCopy.freetItemId;
  delete commentCopy.commentItemId;

  return {
    ...commentCopy,
    _id: commentCopy._id.toString(),
    author: authorId.username.toString(),
    commentedOn: (freetItemId || commentItemId)._id.toString(),
    timeStamp: formatDate(comment.timeStamp),
    dateModified: formatDate(comment.dateModified),
  };
};

export { constructCommentResponse };
