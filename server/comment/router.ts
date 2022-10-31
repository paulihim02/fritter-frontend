import type { NextFunction, Request, Response } from "express";
import express from "express";
import CommentCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as freetValidator from "../freet/middleware";
import * as commentValidator from "./middleware";
import * as util from "./util";
import CommentModel from "./model";

const router = express.Router();

router.use("/", async (req: Request, res: Response, next: NextFunction) => {
  const comments = await CommentModel.find({}).populate(
    "authorId commentItemId freetItemId"
  );

  const deleteComments = comments
    .filter(
      (comment) =>
        comment.commentItemId === null ||
        comment.freetItemId === null ||
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
 * @throws {400} - If ownerID is not given
 * @throws {404} - If no user has given ownerID
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.query;
    console.log("username is", username);
    if (username !== undefined) {
      return next();
    }

    const allComments = await CommentCollection.findAll();
    console.log("all comment", allComments);
    const response = allComments.map(util.constructCommentResponse);
    return res.status(200).json(response);
  },
  [userValidator.isUsernameExists],
  async (req: Request, res: Response) => {
    const { username } = req.query;
    const comments = await CommentCollection.findAllByUsername(
      username as string
    );
    const response = comments.map(util.constructCommentResponse);
    return res.status(200).json(response);
  }
);

/**
 * comment on a comment or a freet
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
    const { commentId, freetId } = req.body;
    console.log(freetComment, commentId, freetId);
    const comment = await CommentCollection.addOne(
      !!freetComment, //truthiness
      req.body.content,
      req.session.userId,
      freetId,
      commentId
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
  [
    userValidator.isUserLoggedIn,
    commentValidator.isValidCommentExists,
    commentValidator.isValidCommentModifier,
  ],
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
 * @name PUT /api/comments/:commentId
 *
 * @param {string} content - the new content for the comment
 * @return {CommentResponse} - the updated comment
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the comment
 * @throws {404} - If the commentId is not valid
 * @throws {400} - If the comment content is empty or a stream of empty spaces
 * @throws {413} - If the comment content is more than 140 characters long
 */
router.put(
  "/:commentId",
  [
    userValidator.isUserLoggedIn,
    commentValidator.isValidCommentExists,
    commentValidator.isValidCommentContent,
    commentValidator.isValidCommentModifier,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
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
