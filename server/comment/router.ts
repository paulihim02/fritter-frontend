import type { NextFunction, Request, Response } from "express";
import express from "express";
import CommentCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as freetValidator from "../freet/middleware";
import * as commentValidator from "./middleware";
import * as util from "./util";
import CommentModel from "./model";
import { Types } from "mongoose";

const router = express.Router();

router.use("/", async (req: Request, res: Response, next: NextFunction) => {
  const comments = await CommentModel.find({}).populate(
    "authorId commentItemId freetItemId"
  );

  const deleteComments = comments
    .filter(
      (comment) =>
        (comment.commentItemId === null && comment.freetItemId === null) ||
        comment.authorId === null
    )
    .map((comment) => CommentCollection.deleteOne(comment._id)); // IDs to delete

  await Promise.all(deleteComments);

  return next();
});
/**
 * Get all comments
 *
 * @name GET /api/comments
 *
 * @return {FreetResponse[]} - A list of all the comments sorted in descending
 *                      order by timestamp
 * @throws {400} - If ownerId is not given
 * @throws {404} - If no user has given ownerId
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentItemId, freetItemId } = req.query;
    console.log(commentItemId, freetItemId);
    if (commentItemId || freetItemId) {
      return next();
    }

    const allComments = await CommentCollection.findAll();

    const response = allComments.map(util.constructCommentResponse);
    return res.status(200).json(response);
  },
  async (req: Request, res: Response) => {
    const { commentItemId, freetItemId } = req.query;

    const comments = commentItemId
      ? await CommentCollection.findAllByCommentItemId(commentItemId as string)
      : await CommentCollection.findAllByFreetItemId(freetItemId as string);

    const response = comments.map(util.constructCommentResponse);
    return res.status(200).json(response);
  }
);

/**
 * comment on a freet
 *
 * @name POST /api/comments
 *
 * @param {string} content - The content of the comment
 * @return {CommentResponse} - The created comment
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the comment content is empty or a stream of empty spaces
 * @throws {413} - If the comment content is more than 140 characters long
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    commentValidator.isValidCommentContent,
    commentValidator.isValidCommentExists,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { freetComment } = req.query;
    const { commentItemId, freetItemId } = req.body;
    console.log(freetComment, commentItemId, freetItemId);
    const comment = await CommentCollection.addOne(
      !!freetComment, //truthiness
      req.body.content,
      req.session.userId,
      freetItemId,
      commentItemId
    );
    // don't call next since its either a comment on a comment or a freet
    return res.status(201).json({
      message: "comment created successfully.",
      comment: util.constructCommentResponse(comment),
    });
  }
);

/**
 * Delete a comment
 *
 * @name DELETE /api/comments/:commentId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the comment
 * @throws {404} - If the commentId is not valid
 */
router.delete(
  "/:commentId",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    await CommentCollection.deleteOne(req.params.commentId);
    res.status(200).json({
      message: "comment deleted successfully.",
    });
  }
);

/**
 * edit comment
 *
 * @name PATCH /api/comments/:commentId
 *
 * @param {string} content - the new content for the comment
 * @return {CommentResponse} - the updated comment
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the comment
 * @throws {404} - If the commentId is not valid
 * @throws {400} - If the comment content is empty or a stream of empty spaces
 * @throws {413} - If the comment content is more than 140 characters long
 */
router.patch(
  "/:commentId",
  [userValidator.isUserLoggedIn, commentValidator.isValidCommentContent],
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params.commentId, req.body.content);
    const comment = await CommentCollection.updateOne(
      req.params.commentId,
      req.body.content
    );

    return res.status(200).json({
      message: "comment updated successfully.",
      comment: util.constructCommentResponse(comment),
    });
  }
);

export { router as commentRouter };
